import { type VariantProps, cva } from 'class-variance-authority'

export const rayaButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 gap-2 active:scale-95',
  {
    variants: {
      color: {
        primary: '',
        secondary: '',
        success: '',
        info: '',
        warning: '',
        destructive: '',
        neutral: '',
      },
      variant: {
        solid: '',
        outline: '',
        soft: '',
        ghost: '',
        link: '',
      },
      size: {
        xs: 'h-7 px-2 text-xs [&_svg]:size-3.5',
        sm: 'h-8 px-3 text-xs [&_svg]:size-4',
        md: 'h-9 px-4 text-sm [&_svg]:size-4',
        lg: 'h-10 px-5 text-sm [&_svg]:size-5',
        xl: 'h-11 px-6 text-base [&_svg]:size-5',
        icon: 'h-9 w-9 p-0',
      },
      block: {
        true: 'w-full',
      },
      square: {
        true: 'p-0 aspect-square',
      },
    },
    compoundVariants: [
      // ----------------
      // SOLID
      // ----------------
      { variant: 'solid', color: 'primary', class: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm' },
      { variant: 'solid', color: 'secondary', class: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm' },
      { variant: 'solid', color: 'destructive', class: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm' },
      { variant: 'solid', color: 'success', class: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm' },
      { variant: 'solid', color: 'info', class: 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm' },
      { variant: 'solid', color: 'warning', class: 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm' },
      { variant: 'solid', color: 'neutral', class: 'bg-foreground text-background hover:bg-foreground/90 shadow-sm' },

      // ----------------
      // OUTLINE
      // ----------------
      { variant: 'outline', color: 'primary', class: 'border border-primary text-primary hover:bg-primary/10' },
      { variant: 'outline', color: 'secondary', class: 'border border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary' },
      { variant: 'outline', color: 'destructive', class: 'border border-destructive text-destructive hover:bg-destructive/10' },
      { variant: 'outline', color: 'success', class: 'border border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10' },
      { variant: 'outline', color: 'info', class: 'border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10' },
      { variant: 'outline', color: 'warning', class: 'border border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10' },
      { variant: 'outline', color: 'neutral', class: 'border border-border text-foreground hover:bg-muted' },

      // ----------------
      // SOFT
      // ----------------
      { variant: 'soft', color: 'primary', class: 'bg-primary/10 text-primary hover:bg-primary/20' },
      { variant: 'soft', color: 'secondary', class: 'bg-secondary/50 text-secondary-foreground hover:bg-secondary/80' },
      { variant: 'soft', color: 'destructive', class: 'bg-destructive/10 text-destructive hover:bg-destructive/20' },
      { variant: 'soft', color: 'success', class: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20' },
      { variant: 'soft', color: 'info', class: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20' },
      { variant: 'soft', color: 'warning', class: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20' },
      { variant: 'soft', color: 'neutral', class: 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground' },

      // ----------------
      // GHOST
      // ----------------
      { variant: 'ghost', color: 'primary', class: 'text-primary hover:bg-primary/10' },
      { variant: 'ghost', color: 'secondary', class: 'text-secondary-foreground hover:bg-secondary' },
      { variant: 'ghost', color: 'destructive', class: 'text-destructive hover:bg-destructive/10' },
      { variant: 'ghost', color: 'success', class: 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10' },
      { variant: 'ghost', color: 'info', class: 'text-blue-600 dark:text-blue-400 hover:bg-blue-500/10' },
      { variant: 'ghost', color: 'warning', class: 'text-amber-600 dark:text-amber-400 hover:bg-amber-500/10' },
      { variant: 'ghost', color: 'neutral', class: 'text-foreground hover:bg-muted' },

      // ----------------
      // LINK
      // ----------------
      { variant: 'link', color: 'primary', class: 'text-primary underline-offset-4 hover:underline' },
      { variant: 'link', color: 'secondary', class: 'text-secondary-foreground underline-offset-4 hover:underline' },
      { variant: 'link', color: 'destructive', class: 'text-destructive underline-offset-4 hover:underline' },
      { variant: 'link', color: 'success', class: 'text-emerald-600 dark:text-emerald-400 underline-offset-4 hover:underline' },
      { variant: 'link', color: 'info', class: 'text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline' },
      { variant: 'link', color: 'warning', class: 'text-amber-600 dark:text-amber-400 underline-offset-4 hover:underline' },
      { variant: 'link', color: 'neutral', class: 'text-foreground underline-offset-4 hover:underline' },
    ],
    defaultVariants: {
      color: 'primary',
      variant: 'solid',
      size: 'md',
    },
  }
)

export type RayaButtonVariants = VariantProps<typeof rayaButtonVariants>