export interface GenerateBriefInput {
  projectTitle: string
  projectType: string
  targetAudience: string
  problem: string
  brandDirection: string
  technicalScope: string
  timeline: string
  budget: string
}

export interface GeneratedSection {
  id: string
  title: string
  content: string
  order: number
}

export async function generateBriefWithAI(input: GenerateBriefInput): Promise<GeneratedSection[]> {
  const prompt = `You are a senior product designer creating a professional design brief. Generate a comprehensive, structured design brief based on the following information:

Project: ${input.projectTitle}
Type: ${input.projectType}
Target Audience: ${input.targetAudience}
Problem to Solve: ${input.problem}
Brand Direction: ${input.brandDirection}
Technical Scope: ${input.technicalScope}
Timeline: ${input.timeline}
Budget: ${input.budget}

Generate exactly 6 sections. Return ONLY a valid JSON array with this exact structure, no other text:
[
  {"id":"1","title":"Project Overview","content":"[2-3 sentence comprehensive overview]","order":1},
  {"id":"2","title":"Target Audience","content":"[detailed audience description]","order":2},
  {"id":"3","title":"Brand Direction","content":"[visual and brand direction details]","order":3},
  {"id":"4","title":"Technical Scope","content":"[technical requirements and scope]","order":4},
  {"id":"5","title":"Timeline & Milestones","content":"[project phases and timeline]","order":5},
  {"id":"6","title":"Success Metrics","content":"[how success will be measured]","order":6}
]`

  try {
    // Try Hugging Face free inference API first
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `<s>[INST] ${prompt} [/INST]`,
          parameters: {
            max_new_tokens: 1200,
            temperature: 0.7,
            return_full_text: false,
          },
        }),
      }
    )

    if (response.ok) {
      const data = await response.json()
      const text = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text
      if (text) {
        const jsonMatch = text.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          const sections = JSON.parse(jsonMatch[0])
          if (Array.isArray(sections) && sections.length > 0) {
            return sections
          }
        }
      }
    }
  } catch {}

  // Fallback: generate structured sections from the input directly
  return generateFallbackSections(input)
}

function generateFallbackSections(input: GenerateBriefInput): GeneratedSection[] {
  return [
    {
      id: '1',
      title: 'Project Overview',
      content: `${input.projectTitle} is a ${input.projectType} project focused on delivering an exceptional user experience. ${input.problem ? `The core challenge to address: ${input.problem}.` : ''} This brief outlines the full scope, direction, and expectations for all stakeholders involved in the project.`,
      order: 1,
    },
    {
      id: '2',
      title: 'Target Audience',
      content: input.targetAudience || 'The target audience encompasses the primary users and stakeholders of this product. Understanding their behaviors, pain points, and motivations is critical to delivering a design that resonates and converts.',
      order: 2,
    },
    {
      id: '3',
      title: 'Brand Direction',
      content: input.brandDirection || 'The visual direction should feel modern, refined, and intentional. Typography, color, spacing, and imagery should all work together to create a cohesive brand experience that communicates trust, quality, and clarity to the audience.',
      order: 3,
    },
    {
      id: '4',
      title: 'Technical Scope',
      content: input.technicalScope || 'The technical scope includes all platforms and integrations required to bring this product to life. All components must be responsive, accessible, and optimized for performance across devices.',
      order: 4,
    },
    {
      id: '5',
      title: 'Timeline & Milestones',
      content: input.timeline ? `Project Timeline: ${input.timeline}. The project will be divided into three phases: Discovery & Strategy, Design & Prototyping, and Refinement & Handoff. Each phase includes review checkpoints and client approval gates.` : 'The project will follow a structured timeline with clear milestones for discovery, design, review, and delivery. Weekly check-ins will ensure alignment and timely delivery.',
      order: 5,
    },
    {
      id: '6',
      title: 'Success Metrics',
      content: input.budget ? `Budget: ${input.budget}. Success will be measured by user engagement, conversion rates, and client satisfaction. Key performance indicators will be defined at project kickoff and tracked throughout the engagement.` : 'Success will be measured by the quality of deliverables, client satisfaction, user adoption, and business impact. All metrics will be agreed upon at project kickoff.',
      order: 6,
    },
  ]
}
