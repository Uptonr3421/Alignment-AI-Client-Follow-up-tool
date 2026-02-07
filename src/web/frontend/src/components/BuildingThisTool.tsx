import React from 'react';
import { Wrench, Sparkles, Shield, Users, Lightbulb, AlertTriangle, CheckCircle, Trophy } from 'lucide-react';

interface BuildStepProps {
  number: number;
  title: string;
  description: string;
  imageName: string;
  icon: React.ReactNode;
}

const BuildStep: React.FC<BuildStepProps> = ({ number, title, description, imageName, icon }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={`/docs/${imageName}`} 
          alt={title}
          className="w-full h-64 object-cover object-top"
        />
        <div className="absolute top-4 left-4 bg-[#E6511A] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg">
          {number}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-[#E6511A]">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-[#252422]">
            {title}
          </h3>
        </div>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export const BuildingThisTool: React.FC = () => {
  const buildSteps: Omit<BuildStepProps, 'icon'>[] = [
    {
      number: 1,
      title: "Trusting the Model's Expertise",
      description: "Asking the model an architectural question at this point about going forward with the build as we build it out on our local machine. And deferring to its expertise. Alignment is all about knowing when to step back and trust your tools. If you have the right tools, this is simple.",
      imageName: "taking-the-models-advice-good-alignment-islknowing-your-strengths-and-trusting-theres-when-appropriate.jpg",
    },
    {
      number: 2,
      title: "Human Intervention When Needed",
      description: "In this image the model gets a little bit overzealous about pressing forward with the project. They overlook a key aspect. What is the whole project actually built on? As we were standing by within the build, we immediately terminated the continuation of the agents' process and intervened to reground the model.",
      imageName: "stepping-in.jpg",
    },
    {
      number: 3,
      title: "Agentic Auto-Heal Technology",
      description: "During the debugging phase, we were running an orchestration of three parallel agents with one orchestrator. In the previous sprint, we had seen something a little unusual. One of our agents actually went down mid-sprint while the other two continued to run autonomously. We intervened on the fly and installed a guard rail with one requirement: If one agent went down, the other two were to be stopped by the orchestrator, rerouted to repair the faulty agent, and get him back online before continuing with their tasks. In this screenshot you can see that guardrail functioning as intended.",
      imageName: "agentic-autoheal-technology-deployed-on-the-fly.jpg",
    },
    {
      number: 4,
      title: "Elevating Work Quality",
      description: "It may seem harsh, but sometimes when you're working with AI to conserve on tokens, they will just give you the bare minimum effort. In this screenshot, I spot this head on with the styling of the output and stop them in their tracks and invite them to elevate their work. They do.",
      imageName: "inviting-agent-swam-to-elevate-work-quality-and-installation-ease-and-stability.jpg",
    },
    {
      number: 5,
      title: "Getting Called Out as a Human",
      description: "In this humorous screenshot, the orchestrator, after finishing their sprint, calls me out swiftly about not fulfilling my end of the task—creating a new Github repo for these files to live in. I can't expect the essential foreman of the construction site that is my code to be tough on his workers and not be tough on me too. I very quickly got that repo online :)",
      imageName: "getting-called-out-for-not-keeping-up-as-a-human.jpg",
    },
    {
      number: 6,
      title: "Catching AI Hallucinations",
      description: "We brought in Claude Sonnet to help guide our agents on their final debugging pass prior to bringing it into a more powerful cloud platform for final deployment. Normally Claude is amazing at this, but tonight he must have been having an off night. Part of the benefit of hiring an AI firm that's worked with AI long enough is we can spot hallucinations when they're pretty much invisible to other people. In this particular situation, I asked Claude to include information that I knew for a fact would require a tool call out. A tool call is something like using the Internet. What makes them unique? The only reason I spotted it was because they're displayed as they occur. In this particular situation, I gave Claude a task requiring a tool call. He output my results, but he never did that tool call. Therefore we knew he was hallucinating instantly. I called him out on it and he quickly course corrected.",
      imageName: "The_Human_In_the_loop_difference_catch_claude_making_a_huge_error_mistaking_a_vital_fallback_connection_for_software_with_a_hallucinated_feature.jpg",
    },
    {
      number: 7,
      title: "Claude Back on Track",
      description: "The screenshot of Claude back on track! After identifying the hallucination, Claude quickly course-corrected and provided the accurate information we needed.",
      imageName: "claude_back_on_track!!.jpg",
    },
    {
      number: 8,
      title: "AI Loyalty and Roles",
      description: "One thing people don't realize is that AI are huge with loyalty and they're huge with buying into roles. If you give them a role and something to rally around, they will do it. In this entire separate instance, we brought in an AI that we believe is a very strong writer in this area to prepare our final sweep prompt for this app prior to going to the cloud.",
      imageName: "claude_scipting_the_cleanup_with_loyalty.jpg",
    }
  ];

  const icons = [
    <Lightbulb size={24} />,
    <AlertTriangle size={24} />,
    <Shield size={24} />,
    <Sparkles size={24} />,
    <Users size={24} />,
    <CheckCircle size={24} />,
    <CheckCircle size={24} />,
    <Trophy size={24} />
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <Wrench className="text-[#E6511A]" size={40} />
          <h1 className="text-4xl font-light text-[#252422]">
            Building This Tool
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          A behind-the-scenes look at how we built this client follow-up automation system using 
          AI-assisted development. This showcase demonstrates the power of human-AI collaboration 
          and the importance of human oversight in AI-driven projects.
        </p>
      </div>

      {/* Key Principles */}
      <div className="bg-gradient-to-r from-[#E6511A]/10 to-[#E6511A]/5 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-semibold text-[#252422] mb-6">Our Development Philosophy</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl">
            <div className="text-[#E6511A] mb-3">
              <Users size={32} />
            </div>
            <h3 className="font-semibold text-[#252422] mb-2">Human-in-the-Loop</h3>
            <p className="text-gray-600 text-sm">
              AI accelerates development, but human expertise guides quality and catches edge cases.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl">
            <div className="text-[#E6511A] mb-3">
              <Shield size={32} />
            </div>
            <h3 className="font-semibold text-[#252422] mb-2">Quality Guardrails</h3>
            <p className="text-gray-600 text-sm">
              Automated systems with built-in safety mechanisms to prevent and recover from failures.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl">
            <div className="text-[#E6511A] mb-3">
              <Sparkles size={32} />
            </div>
            <h3 className="font-semibold text-[#252422] mb-2">Continuous Elevation</h3>
            <p className="text-gray-600 text-sm">
              Pushing AI agents to deliver professional-grade output, not just functional code.
            </p>
          </div>
        </div>
      </div>

      {/* Build Steps */}
      <div className="space-y-8">
        <h2 className="text-3xl font-light text-[#252422] mb-8">The Development Journey</h2>
        <div className="grid gap-8">
          {buildSteps.map((step, index) => (
            <BuildStep 
              key={step.number} 
              {...step} 
              icon={icons[index]}
            />
          ))}
        </div>
      </div>

      {/* Closing Message */}
      <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-[#252422] mb-4">
          The Result: Professional Software, Delivered Fast
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          This client follow-up automation system was built in record time through the power of 
          AI-assisted development, combined with the critical human oversight that ensures quality, 
          security, and reliability. The Cleveland LGBTQ Center now has a professional tool that 
          automates their client outreach—built with care and delivered with confidence.
        </p>
        <div className="inline-flex items-center gap-2 text-[#E6511A] font-medium">
          <Trophy size={24} />
          <span>Built with Care in Cleveland, for Cleveland</span>
        </div>
      </div>
    </div>
  );
};

export default BuildingThisTool;
