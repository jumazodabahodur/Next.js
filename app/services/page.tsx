import Image from 'next/image';

export default function ServicesPage() {
  const services = [
    {
      title: 'Web Development',
      description: 'Building high-performance, responsive websites with modern technologies.',
      icon: '🌐'
    },
    {
      title: 'UI/UX Design',
      description: 'Creating intuitive and visually stunning user experiences.',
      icon: '🎨'
    },
    {
      title: 'Cloud Solutions',
      description: 'Scalable and secure cloud infrastructure for your business.',
      icon: '☁️'
    },
    {
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile applications for iOS and Android.',
      icon: '📱'
    }
  ];

  return (
    <main className="flex-1 overflow-hidden bg-slate-950 text-white">
      <section className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="/services_hero_1778151962729.png"
            alt="Services Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient animate-float">
            Our Services
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            We provide cutting-edge digital solutions to help your business scale and thrive in the modern era.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="glass p-8 hover:scale-105 transition-transform duration-300 group"
            >
              <div className="text-4xl mb-4 group-hover:animate-bounce">
                {service.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-brand-primary">
                {service.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
