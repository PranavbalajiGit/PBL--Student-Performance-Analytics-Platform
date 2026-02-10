import '../styles/globals.css';

export const metadata = {
    title: 'Student Performance Analytics System',
    description: 'Comprehensive student performance analytics platform with role-based access control',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
