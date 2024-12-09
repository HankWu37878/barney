import Header from "./_components/Header";

export default function MainLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en">
        <body>
            <Header/>
            {children}
        </body>
      </html>
    );
  }