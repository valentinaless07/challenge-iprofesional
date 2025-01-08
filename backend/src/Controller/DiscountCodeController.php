<?php

namespace App\Controller;

use App\Repository\DiscountCodeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DiscountCodeController extends AbstractController
{
    #[Route('/code/{code}', name: 'discount_code_details', methods: ['GET'])]
    public function getDiscountCodeDetails(string $code, DiscountCodeRepository $repository): Response
    {
        // Busco el código de descuento en db por su nombre
        $discountCode = $repository->findOneBy(['name' => $code]);

        if (!$discountCode) {
            return new JsonResponse(['error' => 'Código de descuento no encontrado'], 404);
        }

        $discountCodeData = [
            'id' => $discountCode->getId(),
            'name' => $discountCode->getName(),
            'percentage' => $discountCode->getPercentage(),
            'category' => $discountCode->getCategory() ? [
                'id' => $discountCode->getCategory()->getId(),
                'name' => $discountCode->getCategory()->getName(),
            ] : null,
        ];

        return new JsonResponse($discountCodeData);
    }
}
