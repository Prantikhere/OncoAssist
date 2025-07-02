
import { AppShell } from '@/components/layout/AppShell';
import { GuidelineProvider } from '@/context/GuidelineContext';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuidelineProvider>
      <AppShell>{children}</AppShell>
    </GuidelineProvider>
  );
}
