<?php

namespace App\Tests;

use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpClient\MockHttpClient;
use Symfony\Component\HttpClient\Response\MockResponse;

class HTTPClientTest extends TestCase
{
    public function testHttpClientReturnsValidResponse(): void
    {
        $expectedData = [
            'id' => 521583,
            'name' => 'symfony-docs',
            'full_name' => 'symfony/symfony-docs',
        ];

        $mockResponse = new MockResponse(json_encode($expectedData), [
            'http_code' => 200,
            'response_headers' => ['content-type' => 'application/json'],
        ]);

        $client = new MockHttpClient($mockResponse);

        $response = $client->request('GET', 'https://api.github.com/repos/symfony/symfony-docs');

        $this->assertSame(200, $response->getStatusCode());
        $this->assertSame('application/json', $response->getHeaders()['content-type'][0]);

        $content = $response->toArray();
        $this->assertSame(521583, $content['id']);
        $this->assertSame('symfony-docs', $content['name']);
    }
}
