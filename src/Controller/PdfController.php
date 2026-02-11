<?php

namespace App\Controller;

use App\Form\PdfConversionType;
use App\Service\GotenbergService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class PdfController extends AbstractController
{
    #[Route('/', name: 'app_pdf_index')]
    public function index(Request $request, GotenbergService $gotenbergService): Response
    {
        $form = $this->createForm(PdfConversionType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $data = $form->getData();

            try {
                $pdfContent = $gotenbergService->convertUrlToPdfContent($data['url']);
                $filename = 'document_test_'.time().'.pdf';

                return new Response($pdfContent, 200, [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'attachment; filename="' . $filename . '"',
                ]);
            } catch (\Exception $e) {
                $this->addFlash('error', 'Erreur lors de la génération du PDF : ' . $e->getMessage());
            }
        }

        return $this->render('pdf/index.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
