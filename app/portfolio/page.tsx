import Image from 'next/image';

export default function PortfolioPage() {
  const projects = [
    {
      title: 'Project Alpha',
      category: 'Web Design',
      image: '/portfolio_main_1778152051361.png'
    },
    {
      title: 'Project Beta',
      category: 'Mobile Development',
      image: '/portfolio_main_1778152051361.png'
    },
    {
      title: 'Project Gamma',
      category: 'Branding',
      image: '/portfolio_main_1778152051361.png'
    },
    {
      title: 'Project Delta',
      category: 'UI/UX Research',
      image: '/portfolio_main_1778152051361.png'
    }
  ];

  return (
    <main className="flex-1 bg-slate-900 text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <h2 className="text-4xl font-bold mb-4">Selected Work</h2>
          <div className="h-1 w-20 bg-brand-primary rounded-full" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-2xl aspect-video bg-slate-800"
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-0 left-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-brand-accent text-sm font-bold uppercase tracking-wider mb-2 block">
                  {project.category}
                </span>
                <h3 className="text-3xl font-bold">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
