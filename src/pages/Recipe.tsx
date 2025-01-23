import { useParams } from "react-router-dom";

const Recipe = () => {
  const { id } = useParams();
  const recipe = RECIPES.find((r) => r.id === id);

  if (!recipe) {
    return <div className="container mx-auto px-4 py-8">Recipe not found</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="h-[50vh] relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>
      <main className="container mx-auto px-4 -mt-32 relative">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">{recipe.title}</h1>
          <div className="flex gap-4 mb-8 text-muted-foreground">
            <span>{recipe.time}</span>
            <span>•</span>
            <span>{recipe.difficulty}</span>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="font-medium text-primary">{index + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const RECIPES = [
  {
    id: "1",
    title: "Classic Margherita Pizza",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca",
    time: "45 mins",
    difficulty: "Medium",
    ingredients: [
      "Pizza dough",
      "San Marzano tomatoes",
      "Fresh mozzarella",
      "Fresh basil",
      "Extra virgin olive oil",
      "Salt"
    ],
    instructions: [
      "Preheat oven to 500°F (260°C) with pizza stone inside.",
      "Roll out pizza dough on a floured surface.",
      "Spread crushed tomatoes, add torn mozzarella.",
      "Bake for 12-15 minutes until crust is golden.",
      "Top with fresh basil and drizzle with olive oil."
    ]
  },
  // ... other recipes
];

export default Recipe;
