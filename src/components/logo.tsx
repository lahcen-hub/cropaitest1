import { Leaf } from 'lucide-react';
import Link from 'next/link';

export const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <div className="p-1.5 bg-primary rounded-lg">
      <Leaf className="h-6 w-6 text-primary-foreground" />
    </div>
    <span className="text-2xl font-bold text-foreground">CropAI</span>
  </Link>
);
