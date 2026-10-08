import { MartiniIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type CocktailImageProps = {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

export function CocktailImage({
  src,
  alt,
  sizes,
  priority,
  className,
}: CocktailImageProps) {
  return (
    <div className={cn("relative aspect-square overflow-hidden bg-muted", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground">
          <MartiniIcon className="size-1/4" aria-hidden />
        </div>
      )}
    </div>
  );
}
