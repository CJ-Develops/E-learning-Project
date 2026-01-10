import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award, CheckCircle, ShieldCheck, Star } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const id = location.state.scrollTo;
      const el = document.getElementById(id);
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <div className="flex flex-col min-h-screen font-serif selection:bg-[#F2A900] selection:text-[#A51C30]">
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-[#4a0d15] via-[#A51C30] to-[#2b0a0f] text-white" id="home">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#F2A900] rounded-full mix-blend-screen filter blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#A51C30] rounded-full filter blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-[#F2A900] text-sm font-bold tracking-widest uppercase shadow-sm">
                <Star className="h-4 w-4 fill-current" /> New Curriculum Available
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                Unlock Your Potential with <span className="text-[#F2A900]">LAON ATHENAEUM</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-200 italic border-l-4 border-[#F2A900] pl-6 max-w-[600px]">
                "Ang kabataan ang pag-asa ng bayan." Experience academic excellence with a curriculum designed for the modern scholar.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/auth/signup">
                  <Button size="lg" className="bg-white text-[#A51C30] hover:bg-gray-100 w-full sm:w-auto gap-2 py-6 px-8 text-lg font-bold shadow-xl transform hover:-translate-y-1 transition-all">
                    Apply Now <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <button onClick={() => document.getElementById('courses').scrollIntoView({behavior: 'smooth'})} className="inline-flex items-center justify-center rounded-md text-lg font-bold border border-white/40 text-white hover:bg-white/10 px-8 py-2 backdrop-blur-sm transition-all">
                  View Courses
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80" alt="Classical Library" className="object-cover w-full h-full grayscale-[20%] hover:grayscale-0 transition-all duration-700" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Courses Preview */}
      <section className="py-24 bg-white" id="courses">
        <div className="container mx-auto px-4 md:px-6 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="text-sm font-bold text-[#A51C30] uppercase tracking-[0.4em] mb-2">Academic Offerings</h2>
              <h3 className="text-4xl font-bold text-gray-900">Popular Disciplines</h3>
            </motion.div>
            <Link to="/courses" className="hidden lg:block">
              <Button variant="link" className="text-[#A51C30] font-bold text-lg">
                Explore All <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-3 gap-8">
            <CoursePreviewCard
              title="Laravel Course"
              instructor="Prof. Snape"
              image="https://laravel.com/images/home/video-preview-static.jpg"
            />
            <CoursePreviewCard
              title="Database Administration"
              instructor="Prof. Janna"
              image="https://potomac.edu/wp-content/uploads/2025/03/what-does-a-database-administrator-do.png"
            />
            <CoursePreviewCard
              title="Art Appreciation"
              instructor="Prof. Audrey"
              image="https://cdn.britannica.com/78/43678-050-F4DC8D93/Starry-Night-canvas-Vincent-van-Gogh-New-1889.jpg"
            />
          </motion.div>
        </div>
      </section>

      {/* About Us / Features */}
      <section className="py-24 bg-gray-50 border-y border-gray-100" id="aboutUs">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="text-sm font-bold text-[#A51C30] uppercase tracking-[0.4em] mb-4 text-center">The Athenaeum Advantage</h2>
              <h3 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Why Choose Our Institution?</h3>
            </motion.div>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-[#A51C30]" />}
              title="Expert Instructors"
              description="Learn from industry leaders who are passionate about Honor and Excellence."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-[#A51C30]" />}
              title="Scholarly Community"
              description="Connect with peers and grow together in our vibrant, values-driven community."
            />
            <FeatureCard
              icon={<Award className="h-10 w-10 text-[#A51C30]" />}
              title="Prestigious Certification"
              description="Earn certificates that carry the weight of academic excellence and integrity."
            />
          </div>
        </div>
      </section>

      {/* Instructor CTA */}
      <section className="py-24 bg-white" id="mentors">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-[#A51C30] rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 p-12 lg:p-20 text-white space-y-8">
              <h2 className="text-4xl font-bold">Join as an Instructor</h2>
              <p className="text-lg text-white/80 italic font-light leading-relaxed">
                "To teach is to touch a life forever." Share your knowledge and inspire the hope of our fatherland.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-[#F2A900]" />
                  <span className="font-medium tracking-wide text-sm lg:text-base">Create your own curriculum</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-[#F2A900]" />
                  <span className="font-medium tracking-wide text-sm lg:text-base">Impact lives globally</span>
                </li>
              </ul>
              <Link to="/auth/signup?role=teacher">
                <Button size="default" className="bg-[#F2A900] text-[#A51C30] hover:bg-white hover:text-[#A51C30] font-bold px-8 py-3 text-base shadow-lg transition-all transform hover:-translate-y-1">
                  Become a Mentor
                </Button>
              </Link>
            </div>
            <div className="w-full lg:w-1/2 h-[450px] relative">
              <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80" alt="Instructor teaching" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#A51C30] via-transparent to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div 
      variants={fadeInUp}
      className="flex flex-col items-center text-center p-10 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
    >
      <div className="mb-6 p-5 bg-[#A51C30]/5 rounded-2xl group-hover:bg-[#A51C30] group-hover:text-white transition-all duration-500">
        {React.cloneElement(icon, { className: "h-10 w-10 transition-colors duration-500" })}
      </div>
      <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
      <p className="text-gray-500 leading-relaxed italic">{description}</p>
    </motion.div>
  );
}

function CoursePreviewCard({ title, instructor, image, rating, students, price }) {
  return (
    <motion.div 
      variants={fadeInUp}
      className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-2xl transition-all duration-500 group"
    >
      <div className="h-56 w-full overflow-hidden relative">
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all z-10" />
        <img src={image} alt={title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
      </div>
      <div className="p-8">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#A51C30] transition-colors">{title}</h3>
        <p className="text-sm text-gray-500 mt-2 italic">by {instructor}</p>
        <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
            <div className="flex items-center gap-1 text-[#F2A900]">
              <Star className="h-4 w-4 fill-current" />
              <span>{rating}</span>
            </div>
            <span>•</span>
            <span>{students} Scholars</span>
          </div>
          <div className="text-lg font-bold text-[#A51C30]">{price}</div>
        </div>
        <div className="mt-6">
          <Link to="/auth/signup">
            <Button className="w-full bg-[#A51C30] hover:bg-[#851626] font-bold py-6 shadow-md transform hover:-translate-y-1 transition-all">
              Enroll Now
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}