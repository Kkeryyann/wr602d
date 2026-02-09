<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class TestGotenbergController extends AbstractController
{
    public function __construct(
        private HttpClientInterface $client,
    ) {
    }

    #[Route('/test-gotenberg', name: 'test_gotenberg')]
    public function index(): JsonResponse
    {
        $response = $this->client->request(
            'GET',
            'http://gotenberg:3000/health'
        );

        $statusCode = $response->getStatusCode();
        $content = $response->toArray();

        return $this->json([
            'status' => $statusCode,
            'gotenberg' => $content,
            'message' => $statusCode === 200 ? 'Gotenberg is running!' : 'Gotenberg is not available',
        ]);
    }
}
