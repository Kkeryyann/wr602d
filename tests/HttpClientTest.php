<?php

namespace App\Tests;

use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class HttpClientTest extends WebTestCase
{

    public function testHttpClient(): void
    {
        $client = static::getContainer()->get(HttpClientInterface::class);

        $response = $client->request('GET', 'http://localhost:3000');

        $this->assertEquals(200, $response->getStatusCode());
    }
}
