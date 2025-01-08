<?php

namespace App\Controller;

use App\Repository\ProductRepository;
use App\Repository\DiscountCodeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProductController extends AbstractController
{
    #[Route('/products', name: 'products_list', methods: ['GET'])]
    public function getProducts(
        ProductRepository $productRepository,
        DiscountCodeRepository $discountCodeRepository
    ): Response {
        // Obtengo todos los productos
        $products = $productRepository->findAll();

        // Obtengo el descuento para la categoría "Outlet
        $outletDiscountCode = $discountCodeRepository->findOneBy(['name' => 'outlet']);
        $outletDiscountPercentage = $outletDiscountCode ? $outletDiscountCode->getPercentage() : 0;

        // Mapeo cada producto
        $productData = array_map(function ($product) use ($outletDiscountPercentage) {
            $categories = $product->getCategories();
            // Obtengo las categorías del producto
            $categoriesData = $categories ? $categories->map(function ($category) {
                return [
                    'id' => $category->getId(),
                    'name' => $category->getName(),
                ];
            })->toArray() : [];

            $price = (float) $product->getPrice();
            $discount = 0;

            // Verifico si el producto pertenece a la categoría 'Outlet' para aplicar el descuento
            foreach ($categories as $category) {
                if ($category->getName() === 'Outlet') {
                    $discount = $outletDiscountPercentage;
                    break;
                }
            }

            // Calculo el precio total con descuento
            $total_price = $discount > 0 ? $price - $price * ($discount / 100) : $price;

            return [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'image' => $product->getImage(),
                'description' => $product->getDescription(),
                'price' => $price,
                'categories' => $categoriesData,
                'discount' => $discount,
                'total_price' => $total_price,
            ];
        }, $products);

        // Respuesta JSON con los datos de los productos
        return new JsonResponse($productData);
    }
}
