<?php

namespace App\Controller;

use App\Repository\DiscountCodeRepository;
use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class OrderController extends AbstractController
{
    #[Route('/order', name: 'calculate_order_total', methods: ['POST'])]
    public function calculateTotal(
        Request $request,
        ProductRepository $productRepository,
        DiscountCodeRepository $discountCodeRepository
    ): Response {
        $data = json_decode($request->getContent(), true);

        // Validación de los productos
        if (!isset($data['products']) || !is_array($data['products'])) {
            return $this->jsonError(400, 'Los productos son requeridos');
        }

        $subtotal = 0.0;
        $total = 0.0;
        $totalDiscounted = 0.0;
        $maxDiscount = null;

        $providedDiscountCode = isset($data['discountCode']) ? strtolower(trim($data['discountCode'])) : null;

        // Validación para el código "outlet"
        if ($providedDiscountCode === 'outlet') {
            return $this->jsonError(400, 'Código de descuento inválido');
        }

        // Valido si el código de descuento existe en la db
        $validDiscountCode = null;
        if ($providedDiscountCode) {
            $validDiscountCode = $discountCodeRepository->findOneBy(['name' => $providedDiscountCode]);
            if (!$validDiscountCode) {
                return $this->jsonError(400, 'Código de descuento inválido');
            }
        }

        // Obtengo el código de descuento especial "outlet"
        $outletDiscountCode = $discountCodeRepository->findOneBy(['name' => 'outlet']);

        // Iteración sobre cada producto
        foreach ($data['products'] as $productData) {
            // Validación de los campos
            if (!isset($productData['id']) || !isset($productData['quantity'])) {
                return $this->jsonError(400, 'Cada producto debe contener un id y una cantidad');
            }

            // Busco el producto en el repositorio
            $product = $productRepository->find($productData['id']);
            if (!$product) {
                return $this->jsonError(404, 'Producto no encontrado: ' . $productData['id']);
            }

            // Calculo el subtotal
            $price = (float) $product->getPrice();
            $quantity = (int) $productData['quantity'];
            $subtotal += $price * $quantity;

            // Inicializo la variable de descuento del producto
            $productDiscount = null;

            // Verifico si el producto pertenece a la categoría del descuento "outlet"
            if ($outletDiscountCode) {
                foreach ($product->getCategories() as $category) {
                    if ($category->getName() === $outletDiscountCode->getCategory()->getName()) {
                        $productDiscount = [
                            'id' => $outletDiscountCode->getId(),
                            'percentage' => (float) $outletDiscountCode->getPercentage(),
                            'category_id' => $outletDiscountCode->getCategory()->getId(),
                        ];
                    }
                }
            }

            // Verifico si el producto aplica para el código de descuento proporcionado en el body
            if ($validDiscountCode) {
                foreach ($product->getCategories() as $category) {
                    if ($category->getName() === $validDiscountCode->getCategory()->getName()) {
                        $codeDiscount = [
                            'id' => $validDiscountCode->getId(),
                            'percentage' => (float) $validDiscountCode->getPercentage(),
                            'category_id' => $validDiscountCode->getCategory()->getId(),
                        ];

                        // Comparo que descuento tiene mayor porcentaje
                        if (!$productDiscount || $codeDiscount['percentage'] > $productDiscount['percentage']) {
                            $productDiscount = $codeDiscount;
                        }

                        // Actualizo el descuento máximo
                        if (!$maxDiscount || $codeDiscount['percentage'] > $maxDiscount['percentage']) {
                            $maxDiscount = $codeDiscount;
                        }
                    }
                }
            }

            // Calculo el precio con descuento y actualizo el total
            $discountPercentage = $productDiscount ? $productDiscount['percentage'] : 0;
            $discountedPrice = $price - ($price * $discountPercentage / 100);
            $total += $discountedPrice * $quantity;

            // Suma de los descuentos totales aplicados
            $totalDiscounted += $price * $quantity - $discountedPrice * $quantity;
        }

        // Valido que el código de descuento aplique al menos a un producto
        if ($providedDiscountCode && !$maxDiscount) {
            return $this->jsonError(400, 'El código de descuento no aplica a ningún producto');
        }

        // Respuesta JSON con los totales calculados
        return new JsonResponse([
            'total' => $total,
            'subtotal' => $subtotal,
            'discount' => $maxDiscount ? $maxDiscount : ['id' => null, 'percentage' => 0, 'category_id' => null],
            'totalDiscounted' => $totalDiscounted,
            'discountCodeName' => $validDiscountCode ? $validDiscountCode->getName() : null
        ], 200);
    }

    private function jsonError(int $code, string $message): JsonResponse
    {
        return new JsonResponse(['error' => ['code' => $code, 'message' => $message]], $code);
    }
}
