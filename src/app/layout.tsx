import '../../src/app/globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <title>Books Library</title>
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}