<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

class GotenbergService
{
    private HttpClientInterface $httpClient;
    private string $gotenbergUrl;

    public function __construct(HttpClientInterface $httpClient, string $gotenbergUrl)
    {
        $this->httpClient = $httpClient;
        $this->gotenbergUrl = $gotenbergUrl;
    }

    public function convertUrlToPdf(string $url, array $options = []): ResponseInterface
    {
        $formData = array_merge(['url' => $url], $options);

        return $this->httpClient->request('POST', $this->gotenbergUrl . '/forms/chromium/convert/url', [
            'headers' => [
                'Content-type'=>'multipart/form-data'
            ],
            'body' => $formData,
        ]);
    }

    public function convertUrlToPdfContent(string $url, array $options = []): string
    {
        $response = $this->convertUrlToPdf($url, $options);
        return $response->getContent();
    }
}
