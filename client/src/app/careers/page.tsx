import { Button } from "@/components/ui/button";
import { RoyalDivider } from "@/components/ui/royal-divider";
import UniversalBackButton from "@/components/ui/BackButton";
import { Briefcase, Users, Heart, MapPin, Clock, Star } from "lucide-react";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center mb-8">
          <UniversalBackButton position="top-left" fallbackUrl="/" />
        </div>
        
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#4A3526]">
            Join Our Team
          </h1>
          <p className="text-[#5D4037] text-lg max-w-2xl mx-auto font-medium">
            Be part of a mission to preserve and promote India's craft heritage
          </p>
          <div className="flex justify-center scale-75 mt-6">
            <RoyalDivider />
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="bg-white/80 backdrop-blur-md p-12 rounded-3xl border border-[#E5DCCA] shadow-lg mb-16 text-center">
            <h2 className="text-4xl font-serif font-bold text-[#4A3526] mb-6">Building the Future of Artisan Commerce</h2>
            <p className="text-[#5D4037] text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
              At The Artisan's Loom, we're building a platform that connects traditional crafts with modern commerce. 
              We're looking for passionate individuals who want to make a meaningful impact in preserving cultural heritage 
              while building innovative technology solutions.
            </p>
            <Button className="h-14 px-8 bg-[#2F334F] hover:bg-[#1E2135] text-white font-serif font-bold rounded-xl shadow-lg">
              View Open Positions
            </Button>
          </div>

          {/* Why Work With Us */}
          <div className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-[#4A3526] mb-12 text-center">Why Work With Us</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-[#E5DCCA] shadow-lg text-center">
                <div className="w-16 h-16 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-bold text-[#4A3526] mb-3">Meaningful Impact</h3>
                <p className="text-[#5D4037]">
                  Your work directly supports thousands of artisans and helps preserve cultural traditions
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-[#E5DCCA] shadow-lg text-center">
                <div className="w-16 h-16 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-bold text-[#4A3526] mb-3">Growth Opportunities</h3>
                <p className="text-[#5D4037]">
                  Fast-growing company with opportunities to take on increasing responsibilities
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-[#E5DCCA] shadow-lg text-center">
                <div className="w-16 h-16 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-bold text-[#4A3526] mb-3">Collaborative Culture</h3>
                <p className="text-[#5D4037]">
                  Work with a diverse team passionate about technology and cultural preservation
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-[#E5DCCA] shadow-lg text-center">
                <div className="w-16 h-16 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-bold text-[#4A3526] mb-3">Flexible Work</h3>
                <p className="text-[#5D4037]">
                  Hybrid work options with opportunities to visit artisan communities
                </p>
              </div>
            </div>
          </div>

          {/* Open Positions */}
          <div className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-[#4A3526] mb-12 text-center">Open Positions</h2>
            
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-[#E5DCCA] shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[#4A3526]">Senior Full Stack Developer</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-[#5D4037]">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>Bengaluru, India</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Full-time</span>
                      </div>
                    </div>
                  </div>
                  <Button className="h-12 px-6 bg-[#2F334F] hover:bg-[#1E2135] text-white font-serif font-bold rounded-xl shadow-lg">
                    Apply Now
                  </Button>
                </div>
                <p className="text-[#5D4037] mb-4">
                  We're looking for an experienced full-stack developer to help build our e-commerce platform and artisan tools. 
                  You'll work with modern technologies to create solutions that directly impact our artisan community.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#FDFBF7] border border-[#E5DCCA] rounded-full text-sm text-[#4A3526]">React</span>
                  <span className="px-3 py-1 bg-[#FDFBF7] border border-[#E5DCCA] rounded-full text-sm text-[#4A3526]">Node.js</span>
                  <span className="px-3 py-1 bg-[#FDFBF7] border border-[#E5DCCA] rounded-full text-sm text-[#4A3526]">PostgreSQL</span>
                  <span className="px-3 py-1 bg-[#FDFBF7] border border-[#E5DCCA] rounded-full text-sm text-[#4A3526]">Next.js</span>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-[#E5DCCA] shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[#4A3526]">Artisan Relations Manager</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-[#5D4037]">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>Multiple Locations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Full-time</span>
                      </div>
                    </div>
                  </div>
                  <Button className="h-12 px-6 bg-[#2F334F] hover:bg-[#1E2135] text-white font-serif font-bold rounded-xl shadow-lg">
                    Apply Now
                  </Button>
                </div>
                <p className="text-[#5D4037] mb-4">
                  Build and maintain relationships with artisan communities across India. You'll work directly with craftspeople 
                  to understand their needs and help them succeed on our platform.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#FDFBF7] border border-[#E5DCCA] rounded-full text-sm text-[#4A3526]">Relationship Building</span>
                  <span className="px-3 py-1 bg-[#FDFBF7] border border-[#E5DCCA] rounded-full text-sm text-[#4A3526]">Field Work</span>
                  <span className="px-3 py-1 bg-[#FDFBF7] border border-[#E5DCCA] rounded-full text-sm text-[#4A3526]">Cultural Sensitivity</span>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-[#E5DCCA] shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[#4A3526]">UX/UI Designer</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-[#5D4037]">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>New Delhi, India</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Full-time</span>
                      </div>
                    </div>
                  </div>
                  <Button className="h-12 px-6 bg-[#2F334F] hover:bg-[#1E2135] text-white font-serif font-bold rounded-xl shadow-lg">
                    Apply Now
                  </Button>
                </div>
                <p className="text-[#5D4037] mb-4">
                  Design intuitive experiences for both artisan sellers and customer buyers. You'll work on interfaces that 
                  bridge traditional commerce with modern e-commerce expectations.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#FDFBF7] border border-[#E5DCCA] rounded-full text-sm text-[#4A3526]">Figma</span>
                  <span className="px-3 py-1 bg-[#FDFBF7] border border-[#E5DCCA] rounded-full text-sm text-[#4A3526]">User Research</span>
                  <span className="px-3 py-1 bg-[#FDFBF7] border border-[#E5DCCA] rounded-full text-sm text-[#4A3526]">E-commerce</span>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white/80 backdrop-blur-md p-12 rounded-3xl border border-[#E5DCCA] shadow-lg mb-16">
            <h2 className="text-3xl font-serif font-bold text-[#4A3526] mb-8 text-center">Our Benefits</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#4A3526] mb-2">Competitive Salary</h3>
                  <p className="text-[#5D4037]">
                    Above-industry-standard compensation packages with performance bonuses
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#4A3526] mb-2">Health & Wellness</h3>
                  <p className="text-[#5D4037]">
                    Comprehensive health insurance, wellness stipends, and mental health support
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#4A3526] mb-2">Professional Growth</h3>
                  <p className="text-[#5D4037]">
                    Learning stipends, conference attendance, and internal mentorship programs
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#4A3526] mb-2">Flexible Work</h3>
                  <p className="text-[#5D4037]">
                    Hybrid work options with up to 3 days remote work per week
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#4A3526] mb-2">Artisan Visits</h3>
                  <p className="text-[#5D4037]">
                    Annual trips to meet artisans and understand the impact of our work
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#4A3526] mb-2">Time Off</h3>
                  <p className="text-[#5D4037]">
                    25 days PTO, 10+ holidays, and sabbatical opportunities
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Application Process */}
          <div className="text-center">
            <h2 className="text-3xl font-serif font-bold text-[#4A3526] mb-8">Ready to Join Us?</h2>
            <p className="text-[#5D4037] text-lg max-w-2xl mx-auto mb-8">
              Send us your resume and a cover letter explaining why you want to join our mission to preserve India's craft heritage.
            </p>
            <Button className="h-14 px-8 bg-[#2F334F] hover:bg-[#1E2135] text-white font-serif font-bold rounded-xl shadow-lg">
              Send Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}