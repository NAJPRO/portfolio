import {Hero} from '@/components/home/Hero';
import {ProjectsSection} from '@/components/home/ProjectsSection';
import {SignatureBand} from '@/components/home/SignatureBand';
import {OtherWorkSection} from '@/components/home/OtherWorkSection';
import {SkillsSection} from '@/components/home/SkillsSection';
import {ContactSection} from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProjectsSection />
      <SignatureBand />
      <OtherWorkSection />
      <SkillsSection />
      <ContactSection />
    </>
  );
}
