// src/components/ui/label.jsx

import * as React from "react"
import { cva } from "class-variance-authority";

// Définition des variantes pour le style du label
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

// Utilisation de React.forwardRef pour permettre le passage de 'ref' aux composants
const Label = React.forwardRef(({ className, ...props }, ref) => (
  // Le composant rend un simple élément <label> avec les styles appliqués
  <label
    ref={ref}
    className={labelVariants({ className })}
    {...props}
  />
));

// Définition d'un nom d'affichage pour le composant
Label.displayName = "Label";

export { Label, labelVariants };
