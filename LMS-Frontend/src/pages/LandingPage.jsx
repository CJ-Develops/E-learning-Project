import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award, CheckCircle } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 1) If navigated with state (from Navbar), scroll to the requested section
    if (location.state && location.state.scrollTo) {
      const id = location.state.scrollTo;
      const el = document.getElementById(id);
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
      // clear the state so repeated back/forward doesn't re-trigger
      navigate(location.pathname, { replace: true, state: {} });
      return;
    }

    // 2) If there's a hash in the url (e.g. /#courses), scroll to it
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      if (id) {
        const el = document.getElementById(id);
        if (el) {
          requestAnimationFrame(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }
      }
    }
  }, [location, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-primary-50 to-white" id="home">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="inline-block rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800">
                New courses available
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
                Unlock Your Potential with <span className="text-primary-600">EduLearn</span>
              </h1>
              <p className="text-lg text-gray-600 md:text-xl max-w-[600px]">
                Join millions of learners worldwide. Master new skills, advance your career, and explore your passions with our expert-led courses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth/signup">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    View Courses
                  </Button>
                </Link>
              </div>
              <div className="pt-4 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-white bg-gray-200"
                      style={{
                        backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`,
                        backgroundSize: 'cover',
                      }}
                    />
                  ))}
                </div>
                <p>Trusted by 10,000+ students</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                alt="Students learning together"
                className="object-cover w-full h-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Courses Preview - ADDED ID HERE */}
      <section className="py-24 bg-gray-50" id="courses">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="text-3xl font-bold text-gray-900">Popular Courses</h2>
              <p className="text-gray-600 mt-2">Explore our highest-rated content</p>
            </motion.div>
            <Link to="/auth/signup" className="hidden md:block">
              <Button variant="link" className="text-primary-600">
                View All Courses <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <CoursePreviewCard
              title="Web Development Bootcamp"
              instructor="Prof. Snape"
              image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
              rating="4.9"
              students="1.2k"
              price="$89.99"
            />
            <CoursePreviewCard
              title="UI/UX Design Masterclass"
              instructor="Minerva McGonagall"
              image="https://images.unsplash.com/photo-1586717791821-3f44a5638d4b?auto=format&fit=crop&w=600&q=80"
              rating="4.8"
              students="850"
              price="$69.99"
            />
            <CoursePreviewCard
              title="Data Science Fundamentals"
              instructor="Albus Dumbledore"
              image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
              rating="5.0"
              students="2.1k"
              price="$99.99"
            />
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/auth/signup">
              <Button className="w-full">View All Courses</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-20 bg-white" id="aboutUs">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Why Choose EduLearn?</h2>
            <p className="mt-4 text-lg text-gray-600">We provide the best tools and resources for your learning journey.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-primary-600" />}
              title="Expert Instructors"
              description="Learn from industry experts who are passionate about teaching and helping you succeed."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-primary-600" />}
              title="Interactive Community"
              description="Connect with peers, share knowledge, and grow together in our vibrant learning community."
            />
            <FeatureCard
              icon={<Award className="h-10 w-10 text-primary-600" />}
              title="Recognized Certificates"
              description="Earn certificates upon completion to showcase your skills to potential employers."
            />
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 bg-gray-50" id="mentors">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Join as an Instructor</h2>
              <p className="text-lg text-gray-600">
                Share your knowledge and inspire learners around the world. We provide the tools you need to create engaging courses and reach a global audience.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Create your own curriculum</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Earn money for every enrollment</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Impact lives globally</span>
                </li>
              </ul>
              <Link to="/auth/signup?role=teacher">
                <Button size="lg" className="mt-4">
                  Become an Instructor
                </Button>
              </Link>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Teacher explaining"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* small presentational components below */

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border hover:shadow-lg transition-shadow">
      <div className="mb-4 p-3 bg-primary-50 rounded-full">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function CoursePreviewCard({ title, instructor, image, rating, students, price }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border hover:shadow-md transition-shadow">
      <div className="h-44 md:h-36 lg:h-44 w-full bg-gray-100">
        <img src={image} alt={title} className="object-cover w-full h-full" />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">by {instructor}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.449a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.449a1 1 0 00-1.176 0l-3.37 2.449c-.785.57-1.84-.197-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.01 9.384c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69L9.049 2.927z" />
              </svg>
              <span>{rating}</span>
            </div>
            <span>•</span>
            <span>{students} students</span>
          </div>
          <div className="text-sm font-semibold">{price}</div>
        </div>
        <div className="mt-4">
          <Link to="/auth/signup">
            <Button size="sm" className="w-full">
              Enroll now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
