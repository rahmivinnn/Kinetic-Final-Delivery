"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { Activity, BarChart3, FileText, Lock } from "lucide-react"
import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function Home() {
  const [showFreeTrialModal, setShowFreeTrialModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showScheduleDemoModal, setShowScheduleDemoModal] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    condition: ''
  });
  
  const [scheduleFormData, setScheduleFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    date: '',
    time: '',
    message: ''
  });
  
  // Check URL parameters for modal triggers
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('showDemo') === 'true') {
        setShowDemoModal(true);
        // Clean URL without refreshing page
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      if (urlParams.get('showScheduleDemo') === 'true') {
        setShowScheduleDemoModal(true);
        // Clean URL without refreshing page
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleScheduleInputChange = (e) => {
    const { id, value } = e.target;
    setScheduleFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleScheduleSelectChange = (id, value) => {
    setScheduleFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission to schedule a demo
    alert('Demo scheduled successfully! We will contact you shortly.');
    setShowScheduleDemoModal(false);
    // Reset form data
    setScheduleFormData({
      name: '',
      email: '',
      organization: '',
      role: '',
      date: '',
      time: '',
      message: ''
    });
  };

  const handlePaymentComplete = () => {
    // Here you would typically handle the successful payment
    setStep(3);
  };
  
  const resetModal = () => {
    setTimeout(() => {
      setStep(1);
      setFormData({
        name: '',
        email: '',
        phone: '',
        condition: ''
      });
    }, 300);
  };
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-black animate-fadeIn hover:scale-105 transition-transform duration-300">
                  Personalized Recovery Powered by Movement Intelligence
                </h1>
                <p className="text-black md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-slideIn hover:translate-x-2 transition-transform duration-300">
                  Transform your rehabilitation with intelligent movement coaching and data-driven therapy. Our platform
                  bridges home exercises with clinical expertise for a smoother, faster recovery experience.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row animate-fadeIn delay-300">
                  <Button 
                    onClick={() => window.location.href = '/recovery-journey'}
                    className="bg-[#001a41] text-white hover:bg-[#001a41]/90 hover:scale-105 transition-transform duration-300"
                  >
                    Start Your Recovery Journey
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-[#001a41] text-[#001a41] hover:bg-[#001a41]/10 hover:scale-105 transition-transform duration-300"
                    onClick={() => setShowDemoModal(true)}
                  >
                    Watch Demo
                  </Button>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 lg:flex-1 animate-fadeIn delay-500">
                <Image
                  src="/digital-rehabilitation-therapy.png"
                  alt="Rehabilitation therapy with digital screens"
                  width={600}
                  height={600}
                  className="rounded-lg object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Smart Rehabilitation Ecosystem */}
        <section className="py-16 bg-[#f9fafb]" id="features">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#111827] mb-4">Smart Rehabilitation Ecosystem</h2>
              <p className="text-[#4b5563] max-w-2xl mx-auto">
                Comprehensive tools designed by rehabilitation specialists and AI engineers
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-[#f3f4f6] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-[#111827]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Movement Intelligence</h3>
                <p className="text-[#4b5563] text-sm">
                  Computer vision technology that analyzes each movement to ensure therapeutic effectiveness
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-[#f3f4f6] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-[#111827]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Responsive Therapy Plans</h3>
                <p className="text-[#4b5563] text-sm">
                  Dynamic rehabilitation protocols that evolve based on your performance and recovery indicators
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-[#f3f4f6] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-[#111827]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Recovery Analytics</h3>
                <p className="text-[#4b5563] text-sm">
                  Visual progress reports with actionable insights to keep your recovery on track
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-[#f3f4f6] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-[#111827]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Clinical-Grade Privacy</h3>
                <p className="text-[#4b5563] text-sm">
                  Enterprise-level security ensuring your medical information meets healthcare compliance standards
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16" id="how-it-works">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#111827] mb-4">How It Works</h2>
              <p className="text-[#4b5563]">Three simple steps to start your recovery journey</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#f3f4f6] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-[#111827] font-semibold">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Initial Assessment</h3>
                <p className="text-[#4b5563] text-sm">
                  Complete a comprehensive evaluation of your condition and goals
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#f3f4f6] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-[#111827] font-semibold">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Personalized Plan</h3>
                <p className="text-[#4b5563] text-sm">Receive a customized therapy program tailored to your needs</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#f3f4f6] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-[#111827] font-semibold">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
                <p className="text-[#4b5563] text-sm">Monitor your improvements with detailed analytics and feedback</p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16" id="success-stories">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#111827] mb-4">
                See how patients like you achieved their rehabilitation goals with AI assistance
              </h2>
              <p className="text-[#4b5563]">Real results from real patients</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <Image
                    src="/smiling-brown-haired-woman.png"
                    alt="Sarah M."
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">Sarah M.</h4>
                    <p className="text-sm text-[#4b5563]">Knee Rehabilitation</p>
                  </div>
                </div>
                <p className="text-[#4b5563] text-sm italic">
                  "The AI-guided exercises and real-time feedback helped me recover from my knee surgery faster than
                  expected. I'm back to my active lifestyle!"
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <Image
                    src="/athletic-man-short-hair.png"
                    alt="Michael R."
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">Michael R.</h4>
                    <p className="text-sm text-[#4b5563]">Sports Recovery</p>
                  </div>
                </div>
                <p className="text-[#4b5563] text-sm italic">
                  "As a professional athlete, precise movement is crucial. This platform measures my performance with
                  extreme accuracy for optimal recovery."
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <Image
                    src="/older-man-glasses.png"
                    alt="David L."
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">David L.</h4>
                    <p className="text-sm text-[#4b5563]">Back Pain Management</p>
                  </div>
                </div>
                <p className="text-[#4b5563] text-sm italic">
                  "The personalized exercise plans and progress tracking have made a huge difference in managing my
                  chronic back pain. Highly recommended!"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="py-16 bg-[#f9fafb]" id="resources">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#111827] mb-4">Resources</h2>
              <p className="text-[#4b5563] max-w-2xl mx-auto">
                Helpful guides and information to support your rehabilitation journey
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Exercise Guides</h3>
                <p className="text-[#4b5563] text-sm mb-4">
                  Detailed instructions and videos for common rehabilitation exercises
                </p>
                <Link href="/resources/exercise-guides" className="text-[#001a41] text-sm font-medium hover:underline">
                  Learn more →
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Recovery Tips</h3>
                <p className="text-[#4b5563] text-sm mb-4">
                  Expert advice to maximize your rehabilitation results and prevent setbacks
                </p>
                <Link href="/resources/recovery-tips" className="text-[#001a41] text-sm font-medium hover:underline">
                  Learn more →
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">FAQ</h3>
                <p className="text-[#4b5563] text-sm mb-4">
                  Answers to common questions about our platform and rehabilitation process
                </p>
                <Link href="/resources/faq" className="text-[#001a41] text-sm font-medium hover:underline">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#111827] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 text-white animate-fadeIn hover-glow transition-all duration-300">Take the First Step Toward Better Recovery</h2>
            <p className="mb-8 max-w-2xl mx-auto text-white animate-fadeIn hover-glow transition-all duration-300" style={{animationDelay: '0.1s'}}>
              Join a community of successful recoveries supported by cutting-edge rehabilitation technology
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-slideIn" style={{animationDelay: '0.2s'}}>
              <Button 
                onClick={() => {
                  setShowFreeTrialModal(true);
                  setStep(1);
                }}
                className="bg-white text-[#111827] hover:bg-[#f3f4f6] hover:scale-105 transition-transform duration-300"
              >
                Start Free Trial
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 hover:scale-105 transition-transform duration-300"
                onClick={() => setShowScheduleDemoModal(true)}
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Free Trial Modal */}
      <Dialog open={showFreeTrialModal} onOpenChange={(open) => {
        setShowFreeTrialModal(open);
        if (!open) resetModal();
      }}>
        <DialogContent className="sm:max-w-md">
          {step === 1 && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-[#111827] mb-2">Start Your Free Trial</DialogTitle>
                <DialogDescription>
                  Fill in your details to begin your personalized rehabilitation journey.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your full name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="Enter your phone number" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Rehabilitation Condition</Label>
                  <Input 
                    id="condition" 
                    placeholder="E.g., Knee injury, back pain, etc." 
                    value={formData.condition}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full bg-[#111827] hover:bg-[#1f2937]">Continue to Payment</Button>
                </DialogFooter>
                <p className="text-sm text-[#4b5563] text-center">
                  By signing up, you agree to our{" "}
                  <Link href="/terms" className="text-[#111827] underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#111827] underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-[#111827]">Complete Your Payment</DialogTitle>
                <DialogDescription>
                  Choose your preferred payment method to start your free trial.
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="card" className="w-full py-4">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="card">Credit Card</TabsTrigger>
                  <TabsTrigger value="paypal">PayPal</TabsTrigger>
                </TabsList>
                
                <TabsContent value="card" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nameOnCard">Name on Card</Label>
                    <Input id="nameOnCard" placeholder="John Doe" />
                  </div>
                  <Button 
                    onClick={handlePaymentComplete}
                    className="w-full bg-[#111827] hover:bg-[#1f2937] mt-4"
                  >
                    Pay $29.99/month
                  </Button>
                </TabsContent>
                
                <TabsContent value="paypal" className="space-y-4">
                  <div className="text-center p-4">
                    <Image 
                      src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" 
                      alt="PayPal" 
                      width={111} 
                      height={69} 
                      className="mx-auto mb-4" 
                    />
                    <p className="text-sm text-[#4b5563] mb-4">Click the button below to pay with PayPal</p>
                    <Button 
                      onClick={handlePaymentComplete}
                      className="w-full bg-[#0070ba] hover:bg-[#005ea6]"
                    >
                      Pay with PayPal
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-[#4b5563]">
                  Your subscription will begin immediately. You can cancel anytime during your free trial period.
                </p>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="mb-6 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <DialogTitle className="text-2xl font-bold text-[#111827] mb-4">Registration Successful!</DialogTitle>
              <p className="text-[#4b5563] mb-6">Thank you for signing up for your free trial. Check your email for next steps.</p>
              <Button 
                onClick={() => setShowFreeTrialModal(false)}
                className="bg-[#111827] hover:bg-[#1f2937]"
              >
                Return to Home
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-white text-black py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="animate-fadeIn" style={{animationDelay: '0.1s'}}>
              <h3 className="text-lg font-bold mb-4 hover-glow transition-all duration-300">Kinetic Rehab</h3>
              <p className="mb-4 hover-lift transition-all duration-300">
                Revolutionizing rehabilitation through intelligent movement analysis and personalized therapy plans.
              </p>
              <div className="flex space-x-4">
                {/* Social Media Icons */}
                <a href="#" className="hover-lift hover:text-[#001a41] transition-all duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="hover-lift hover:text-[#001a41] transition-all duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="hover-lift hover:text-[#001a41] transition-all duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="hover-lift hover:text-[#001a41] transition-all duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Resources */}
            <div className="animate-fadeIn" style={{animationDelay: '0.2s'}}>
              <h3 className="text-lg font-bold mb-4 hover-glow transition-all duration-300">Resources</h3>
              <ul>
                <li className="mb-2">
                  <Link href="/blog" className="hover-lift hover:text-[#001a41] transition-all duration-300">Blog</Link>
                </li>
                <li className="mb-2">
                  <Link href="/case-studies" className="hover-lift hover:text-[#001a41] transition-all duration-300">Case Studies</Link>
                </li>
                <li className="mb-2">
                  <Link href="/webinars" className="hover-lift hover:text-[#001a41] transition-all duration-300">Webinars</Link>
                </li>
                <li className="mb-2">
                  <Link href="/documentation" className="hover-lift hover:text-[#001a41] transition-all duration-300">Documentation</Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="animate-fadeIn" style={{animationDelay: '0.3s'}}>
              <h3 className="text-lg font-bold mb-4 hover-glow transition-all duration-300">Company</h3>
              <ul>
                <li className="mb-2">
                  <Link href="/about" className="hover-lift hover:text-[#001a41] transition-all duration-300">About Us</Link>
                </li>
                <li className="mb-2">
                  <Link href="/careers" className="hover-lift hover:text-[#001a41] transition-all duration-300">Careers</Link>
                </li>
                <li className="mb-2">
                  <Link href="/press" className="hover-lift hover:text-[#001a41] transition-all duration-300">Press</Link>
                </li>
                <li className="mb-2">
                  <Link href="/contact" className="hover-lift hover:text-[#001a41] transition-all duration-300">Contact</Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="animate-fadeIn" style={{animationDelay: '0.4s'}}>
              <h3 className="text-lg font-bold mb-4 hover-glow transition-all duration-300">Contact</h3>
              <p className="mb-2 hover-lift transition-all duration-300">Email: info@kineticrehab.com</p>
              <p className="mb-2 hover-lift transition-all duration-300">Phone: (123) 456-7890</p>
              <p className="hover-lift transition-all duration-300">Address: 123 Rehab Street, Health City, HC 12345</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-[#e5e7eb] mt-8 pt-8 text-center animate-fadeIn" style={{animationDelay: '0.5s'}}>
            <p className="hover-glow transition-all duration-300">&copy; {new Date().getFullYear()} Kinetic Rehab. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      <Dialog open={showDemoModal} onOpenChange={(open) => setShowDemoModal(open)}>
        <DialogContent className="sm:max-w-3xl h-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-[#111827] mb-2">Watch Our Demo</DialogTitle>
            <DialogDescription>
              See how our AI-powered rehabilitation platform works
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-[#111827] rounded-lg mb-8 flex items-center justify-center">
            <video 
              className="w-full h-full" 
              controls 
              autoPlay
              src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
              poster="/rehabilitation-therapy-data.png"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="text-[#4b5563] mb-8">
            See how our AI-powered rehabilitation platform can transform your recovery journey with personalized
            exercises, real-time feedback, and progress tracking.
          </p>
          <DialogFooter className="flex justify-center gap-4">
            <Button variant="outline" className="border-[#111827] text-[#111827]" onClick={() => setShowDemoModal(false)}>
              Back to Home
            </Button>
            <Button 
              className="bg-[#111827] hover:bg-[#1f2937]"
              onClick={() => {
                setShowDemoModal(false);
                setShowFreeTrialModal(true);
              }}
            >
              Start Free Trial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Schedule Demo Modal */}
      <Dialog open={showScheduleDemoModal} onOpenChange={(open) => setShowScheduleDemoModal(open)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#111827] mb-2">Schedule a Demo</DialogTitle>
            <DialogDescription>
              Fill in your details to schedule a personalized demo of our platform.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleScheduleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Enter your full name" 
                value={scheduleFormData.name}
                onChange={handleScheduleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                value={scheduleFormData.email}
                onChange={handleScheduleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organization (if applicable)</Label>
              <Input 
                id="organization" 
                placeholder="Enter your organization name" 
                value={scheduleFormData.organization}
                onChange={handleScheduleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Your Role</Label>
              <Select onValueChange={(value) => handleScheduleSelectChange('role', value)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="healthcare-provider">Healthcare Provider</SelectItem>
                  <SelectItem value="administrator">Administrator</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Preferred Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={scheduleFormData.date}
                onChange={handleScheduleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Preferred Time</Label>
              <Select onValueChange={(value) => handleScheduleSelectChange('time', value)}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9am">9:00 AM</SelectItem>
                  <SelectItem value="10am">10:00 AM</SelectItem>
                  <SelectItem value="11am">11:00 AM</SelectItem>
                  <SelectItem value="1pm">1:00 PM</SelectItem>
                  <SelectItem value="2pm">2:00 PM</SelectItem>
                  <SelectItem value="3pm">3:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Additional Information</Label>
              <Textarea
                id="message"
                placeholder="Tell us about your specific interests or questions"
                className="min-h-[100px]"
                value={scheduleFormData.message}
                onChange={handleScheduleInputChange}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full bg-[#111827] hover:bg-[#1f2937]">Schedule Demo</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
