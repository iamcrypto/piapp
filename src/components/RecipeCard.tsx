import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface RecipeCardProps {
  id: string;
  title: string;
  image: string;
  time: string;
  difficulty: string;
}

export function RecipeCard({ id, title, image, time, difficulty }: RecipeCardProps) {
  return (
    <Link to={`/recipe/${id}`}>
      <Card className="recipe-card overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardHeader className="p-4">
          <h3 className="font-semibold text-lg">{title}</h3>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
          <span>{time}</span>
          <span>{difficulty}</span>
        </CardContent>
      </Card>
    </Link>
  );
}