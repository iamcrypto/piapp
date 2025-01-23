export function Hero() {
  return (
    <div className="relative h-[70vh] mb-16">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
          alt="Featured Recipe"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>
      <div className="relative h-full flex items-end pb-16 container mx-auto px-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Delicious Recipes
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Explore our collection of carefully curated recipes for every occasion
          </p>
        </div>
      </div>
    </div>
  );
}