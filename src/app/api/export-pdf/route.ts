import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
    try {
        const { html } = await req.json();

        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();

        await page.setContent(`
            <html>
                <head>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
                </head>
                <body class="bg-white">
                    <h1>SheSync</h1>
                    ${html}
                </body>
            </html>
        `);

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
        });

        await browser.close();

        return new Response(Buffer.from(pdfBuffer), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "attachment; filename=report.pdf",
            },
        });
    } catch (err) {
        console.error("PDF generation failed:", err);
        return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
    }
}
