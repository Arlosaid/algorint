import React, { useState } from 'react';
import {
  Briefcase,
  FileText,
  FolderGit2,
  Send,
  Target,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  Star,
  Users,
  Zap,
  Brain,
  Heart,
  ExternalLink,
  Globe,
  Linkedin,
  Github,
  BookOpen,
  Award,
  TrendingUp
} from 'lucide-react';

/**
 * CareerTipsPage
 * ==============
 * Guía completa para el proceso de búsqueda de empleo tech:
 * - Entrevistas conductuales (behavioral interviews)
 * - CV/Resume optimizado
 * - Portfolio de proyectos
 * - Estrategias para aplicar a ofertas
 * 
 * Basado en experiencias reales y mejores prácticas del sector.
 */

type TabId = 'interviews' | 'cv' | 'portfolio' | 'applications';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
  description: string;
}

const tabs: Tab[] = [
  { 
    id: 'interviews', 
    label: 'Entrevistas', 
    icon: MessageSquare,
    description: 'Domina las entrevistas conductuales'
  },
  { 
    id: 'cv', 
    label: 'CV / Resume', 
    icon: FileText,
    description: 'Crea un CV que destaque'
  },
  { 
    id: 'portfolio', 
    label: 'Portfolio', 
    icon: FolderGit2,
    description: 'Muestra tu trabajo'
  },
  { 
    id: 'applications', 
    label: 'Aplicar', 
    icon: Send,
    description: 'Estrategias efectivas'
  },
];

// ============================================================================
// TIPOS DE DATOS
// ============================================================================

interface StarExample {
  situation: string;
  task: string;
  action: string;
  result: string;
}

interface InterviewQuestion {
  question: string;
  tip: string;
  exampleApproach?: string;
}

interface CVSection {
  title: string;
  icon: React.ElementType;
  tips: string[];
  example?: string;
}

interface PortfolioIdea {
  name: string;
  description: string;
  technologies: string[];
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
}

// ============================================================================
// DATOS DE CONTENIDO
// ============================================================================

const behavioralQuestions: InterviewQuestion[] = [
  {
    question: "Háblame de ti",
    tip: "Estructura tu respuesta en 3-4 minutos: rol actual → estudios relevantes → experiencia previa → lo que haces fuera del trabajo → por qué esta entrevista.",
    exampleApproach: "Soy ingeniero de software con 3 años de experiencia en desarrollo backend. Me gradué en Ingeniería Informática y durante la carrera desarrollé varios proyectos personales..."
  },
  {
    question: "Cuéntame sobre un desafío técnico que hayas enfrentado",
    tip: "Usa el método STAR: Situación → Tarea → Acción → Resultado. Enfócate en TUS acciones específicas, no en lo que hizo el equipo.",
    exampleApproach: "Situación: Teníamos un algoritmo que procesaba datos en 10 segundos. Acción: Analicé el código, identifiqué el cuello de botella y propuse usar caché. Resultado: Redujimos el tiempo a 0.5 segundos."
  },
  {
    question: "¿Cuáles son tus fortalezas y debilidades?",
    tip: "Para debilidades: sé honesto pero muestra cómo trabajas para mejorar. NUNCA uses falsas debilidades como 'trabajo demasiado'.",
    exampleApproach: "Fortaleza: Resolución de problemas complejos. Debilidad: Me cuesta la tecnología X, por eso estoy tomando cursos y practicando con proyectos personales."
  },
  {
    question: "Describe un conflicto con un compañero y cómo lo resolviste",
    tip: "Muestra empatía, comunicación efectiva y enfoque en la solución. Evita culpar a otros.",
    exampleApproach: "Tuve un desacuerdo sobre la arquitectura del proyecto. Propuse una reunión para escuchar su perspectiva, presenté mis argumentos con datos, y llegamos a un compromiso que combinó lo mejor de ambas ideas."
  },
  {
    question: "¿Por qué quieres trabajar aquí?",
    tip: "Investiga la empresa antes. Menciona proyectos específicos, cultura, tecnologías o misión que te atraigan genuinamente.",
  },
  {
    question: "Cuéntame sobre un error que cometiste",
    tip: "Sé honesto, enfócate en lo que aprendiste y las medidas que tomaste para evitar que se repita.",
  },
];

const starExample: StarExample = {
  situation: "En mi anterior empresa, teníamos un sistema de procesamiento de pedidos que se volvía extremadamente lento durante las horas pico, causando quejas de clientes.",
  task: "Mi tarea era identificar el problema y proponer una solución que mejorara el rendimiento sin una reescritura completa del sistema.",
  action: "Analicé los logs y métricas del sistema, identifiqué que el cuello de botella estaba en las consultas a la base de datos. Propuse implementar un sistema de caché con Redis y optimizar las queries más costosas. Lideré la implementación, creando primero un POC y luego desplegando gradualmente.",
  result: "Redujimos el tiempo de respuesta de 8 segundos a 200ms, lo que resultó en una disminución del 40% en quejas de clientes y nos permitió manejar 3x más tráfico en horas pico."
};

const questionsToAsk: { category: string; questions: string[] }[] = [
  {
    category: "Sobre el equipo y rol",
    questions: [
      "¿Cuántas personas hay en el equipo y cuáles son sus roles?",
      "¿Cómo es un día típico en este puesto?",
      "¿Cómo se planifica y prioriza el trabajo?",
      "¿Qué metodología de desarrollo utilizan?"
    ]
  },
  {
    category: "Mostrando conocimiento técnico",
    questions: [
      "Vi que usan [tecnología X], ¿cómo manejan [problema específico]?",
      "¿Cuáles son los mayores desafíos técnicos actuales del equipo?",
      "¿Cómo manejan la deuda técnica?"
    ]
  },
  {
    category: "Crecimiento profesional",
    questions: [
      "¿Qué oportunidades de aprendizaje ofrece la empresa?",
      "¿Cómo es el proceso de promoción y desarrollo de carrera?",
      "¿Hay oportunidades de trabajar en diferentes proyectos o tecnologías?"
    ]
  }
];

const cvSections: CVSection[] = [
  {
    title: "Información de contacto",
    icon: Users,
    tips: [
      "Solo lo esencial: email, teléfono, LinkedIn, GitHub",
      "NO incluir: foto, dirección completa, edad, estado civil",
      "Los enlaces deben ser funcionales y profesionales"
    ]
  },
  {
    title: "Habilidades técnicas",
    icon: Zap,
    tips: [
      "Agrupa por categorías: Lenguajes, Frameworks, Bases de datos, etc.",
      "Ordena por dominio: las tecnologías que mejor manejas primero",
      "Sé honesto: indica si eres principiante en algo",
      "Adapta según la oferta: prioriza tecnologías relevantes"
    ]
  },
  {
    title: "Experiencia profesional",
    icon: Briefcase,
    tips: [
      "Habla de TI, no del equipo (evita 'nosotros hicimos...')",
      "Enfócate en el VALOR que aportaste, no solo en las tecnologías",
      "Cuantifica logros: 'Mejoré el rendimiento en un 95%'",
      "Estructura: Qué hiciste → Cómo lo hiciste → Qué resultado tuvo"
    ],
    example: "Optimicé el algoritmo de procesamiento de estados de dispositivos, reduciendo el tiempo de procesamiento en un 95% y mejorando la experiencia de usuario."
  },
  {
    title: "Proyectos",
    icon: FolderGit2,
    tips: [
      "Esencial si no tienes experiencia laboral relevante",
      "Incluye enlaces a GitHub/demo cuando sea posible",
      "Describe el problema que resuelve, no solo las tecnologías",
      "2-3 proyectos de calidad > muchos proyectos mediocres"
    ]
  },
  {
    title: "Educación",
    icon: BookOpen,
    tips: [
      "Mantén esta sección breve si ya tienes experiencia",
      "La nota media es opcional (omítela si es baja)",
      "Menciona especializaciones o proyectos relevantes",
      "Incluye certificaciones relevantes"
    ]
  }
];

const cvMistakes = [
  { mistake: "CV de más de 1 página", fix: "Condensa en 1 página (máximo 2 si tienes mucha experiencia)" },
  { mistake: "Incluir fotografía", fix: "No incluir foto (excepto si es costumbre obligatoria en tu país)" },
  { mistake: "Diseños complejos con columnas y gráficos", fix: "Diseño limpio y simple, fácil de escanear" },
  { mistake: "Listar tecnologías sin contexto", fix: "Mostrar qué lograste CON esas tecnologías" },
  { mistake: "Usar 'nosotros' o 'el equipo'", fix: "Hablar en primera persona sobre TUS contribuciones" },
  { mistake: "CV genérico para todas las ofertas", fix: "Adaptar énfasis según el puesto" },
  { mistake: "PDF que no permite búsqueda de texto", fix: "Verificar que el PDF permite copiar/buscar texto" },
];

const portfolioIdeas: PortfolioIdea[] = [
  {
    name: "E-Commerce Platform",
    description: "Tienda online con carrito, pagos y gestión de inventario. Muestra full-stack skills.",
    technologies: ["React/Vue", "Node.js/Python", "PostgreSQL", "Stripe API"],
    difficulty: "Intermedio"
  },
  {
    name: "Red Social Mini",
    description: "Clone simplificado de Twitter con posts, follows y feed en tiempo real.",
    technologies: ["Frontend moderno", "WebSockets", "Base de datos", "Auth"],
    difficulty: "Intermedio"
  },
  {
    name: "RSS News Aggregator",
    description: "Agregador de feeds RSS con categorización y búsqueda.",
    technologies: ["Backend API", "Web scraping", "Frontend", "Docker"],
    difficulty: "Principiante"
  },
  {
    name: "DevOps Dashboard",
    description: "Panel para monitoreo de deploys y métricas de sistemas.",
    technologies: ["React", "Docker", "CI/CD", "Grafana/Prometheus"],
    difficulty: "Avanzado"
  },
  {
    name: "API REST + App Móvil",
    description: "Backend robusto con documentación + app móvil que lo consume.",
    technologies: ["FastAPI/Express", "React Native/Flutter", "JWT Auth"],
    difficulty: "Avanzado"
  }
];

const applicationStrategies = [
  {
    title: "Crea tu lista de empresas target",
    icon: Target,
    description: "Haz una lista de 25-30 empresas donde te gustaría trabajar. Incluye empresas grandes, medianas y startups.",
    tips: [
      "Investiga la cultura y stack tecnológico de cada una",
      "Revisa sus portales de empleo regularmente",
      "Usa un spreadsheet para trackear aplicaciones"
    ]
  },
  {
    title: "Optimiza tu perfil de LinkedIn",
    icon: Linkedin,
    description: "LinkedIn es crucial en tech. Activa 'Open to Work' y mantén tu perfil actualizado.",
    tips: [
      "Usa keywords relevantes para tu rol ideal",
      "Pide recomendaciones a colegas anteriores",
      "Publica contenido técnico ocasionalmente",
      "Conecta con recruiters de empresas target"
    ]
  },
  {
    title: "Networking proactivo",
    icon: Users,
    description: "No tengas miedo de contactar empleados de empresas que te interesan.",
    tips: [
      "Pide informational interviews (no directamente trabajo)",
      "Pregunta por referrals internos (muchas empresas dan bonus por referir)",
      "Asiste a meetups y eventos tech",
      "Contribuye a proyectos open source"
    ]
  },
  {
    title: "Gestiona bien tu tiempo",
    icon: TrendingUp,
    description: "Planifica las entrevistas estratégicamente para no quemarte.",
    tips: [
      "Máximo 2-3 entrevistas informales por día",
      "Solo 1 entrevista técnica por día",
      "Deja días de descanso entre técnicas",
      "No tengas miedo de pedir otra fecha al recruiter"
    ]
  }
];

// ============================================================================
// COMPONENTES AUXILIARES
// ============================================================================

const SectionCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  gradient?: boolean;
}> = ({ children, className = "", gradient = false }) => (
  <div className={`
    rounded-xl p-6 
    ${gradient 
      ? 'bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-primary-500/20' 
      : 'bg-dark-800/50 border border-dark-700'
    }
    ${className}
  `}>
    {children}
  </div>
);

const Accordion: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ElementType;
}> = ({ title, children, defaultOpen = false, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-dark-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-dark-800/50 hover:bg-dark-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={18} className="text-primary-400" />}
          <span className="font-medium text-white">{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown size={18} className="text-dark-400" />
        ) : (
          <ChevronRight size={18} className="text-dark-400" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 py-4 bg-dark-800/30 border-t border-dark-700">
          {children}
        </div>
      )}
    </div>
  );
};

const TipCard: React.FC<{
  type: 'tip' | 'warning' | 'success';
  title: string;
  children: React.ReactNode;
}> = ({ type, title, children }) => {
  const styles = {
    tip: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      icon: Lightbulb,
      iconColor: 'text-blue-400'
    },
    warning: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      icon: AlertTriangle,
      iconColor: 'text-amber-400'
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      icon: CheckCircle,
      iconColor: 'text-green-400'
    }
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`${style.iconColor} flex-shrink-0 mt-0.5`} size={20} />
        <div>
          <h4 className="font-medium text-white mb-1">{title}</h4>
          <div className="text-dark-300 text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SECCIONES DE CONTENIDO
// ============================================================================

const InterviewsSection: React.FC = () => (
  <div className="space-y-8">
    {/* Intro */}
    <SectionCard gradient>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="text-primary-400" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Entrevistas Conductuales</h3>
          <p className="text-dark-300">
            Las entrevistas conductuales evalúan tus <span className="text-primary-400">soft skills</span>: 
            comunicación, trabajo en equipo, resolución de conflictos y liderazgo. El objetivo es 
            verificar que encajas con el puesto, el equipo y la cultura de la empresa.
          </p>
        </div>
      </div>
    </SectionCard>

    <TipCard type="success" title="Buenas noticias">
      Si el puesto encaja con tu experiencia y te comunicas de forma clara, es muy difícil que 
      te filtren en esta etapa. Los entrevistadores buscan <span className="text-red-400">red flags</span> en 
      tus respuestas, no respuestas perfectas.
    </TipCard>

    {/* Preparación */}
    <div>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Brain className="text-secondary-400" size={20} />
        Preparación: Reflexiona sobre tu experiencia
      </h3>
      <SectionCard>
        <p className="text-dark-300 mb-4">
          Selecciona <span className="text-white font-medium">2-3 proyectos relevantes</span> de 
          tu carrera y prepara respuestas para estos escenarios:
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            "Desafíos técnicos que surgieron",
            "Errores que cometiste y cómo los solucionaste",
            "Conflictos con compañeros o stakeholders",
            "Momentos donde tomaste liderazgo",
            "Decisiones que tomaste y su impacto",
            "Qué harías diferente si empezaras de nuevo"
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-dark-300">
              <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>

    {/* Método STAR */}
    <div>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Star className="text-amber-400" size={20} />
        Método STAR: Estructura tus respuestas
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Situación */}
        <SectionCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-400 font-bold text-lg">S</span>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Situación</h4>
              <p className="text-dark-400 text-sm">{starExample.situation}</p>
            </div>
          </div>
        </SectionCard>
        {/* Tarea */}
        <SectionCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-purple-400 font-bold text-lg">T</span>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Tarea</h4>
              <p className="text-dark-400 text-sm">{starExample.task}</p>
            </div>
          </div>
        </SectionCard>
        {/* Acción */}
        <SectionCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-green-400 font-bold text-lg">A</span>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Acción</h4>
              <p className="text-dark-400 text-sm">{starExample.action}</p>
            </div>
          </div>
        </SectionCard>
        {/* Resultado */}
        <SectionCard>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-400 font-bold text-lg">R</span>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Resultado</h4>
              <p className="text-dark-400 text-sm">{starExample.result}</p>
            </div>
          </div>
        </SectionCard>
      </div>
      <TipCard type="warning" title="¡La Acción es lo más importante!">
        La mayoría de candidatos se extienden en la Situación y descuidan la Acción. 
        Detalla el <strong>qué</strong>, <strong>cómo</strong> y <strong>por qué</strong> de 
        tus acciones. Ahí está el valor real.
      </TipCard>
    </div>

    {/* Preguntas comunes */}
    <div>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <MessageSquare className="text-primary-400" size={20} />
        Preguntas comunes y cómo abordarlas
      </h3>
      <div className="space-y-3">
        {behavioralQuestions.map((q, idx) => (
          <Accordion key={idx} title={q.question} icon={Target}>
            <div className="space-y-3">
              <TipCard type="tip" title="Consejo">
                {q.tip}
              </TipCard>
              {q.exampleApproach && (
                <div className="bg-dark-900/50 rounded-lg p-3 text-sm text-dark-300 italic">
                  <span className="text-dark-500">Ejemplo de enfoque:</span> "{q.exampleApproach}"
                </div>
              )}
            </div>
          </Accordion>
        ))}
      </div>
    </div>

    {/* Fortalezas y debilidades */}
    <div>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Heart className="text-red-400" size={20} />
        Fortalezas y Debilidades: Cómo responder
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard>
          <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
            <CheckCircle size={18} />
            Fortalezas
          </h4>
          <ul className="space-y-2 text-dark-300 text-sm">
            <li>• Sé específico y da ejemplos concretos</li>
            <li>• Relaciona tus fortalezas con el puesto</li>
            <li>• Ejemplo: "Soy bueno descomponiendo problemas complejos. En mi último proyecto..."</li>
          </ul>
        </SectionCard>
        <SectionCard>
          <h4 className="font-semibold text-amber-400 mb-3 flex items-center gap-2">
            <AlertTriangle size={18} />
            Debilidades
          </h4>
          <ul className="space-y-2 text-dark-300 text-sm">
            <li>• <span className="text-red-400">EVITA:</span> "Trabajo demasiado" o falsas debilidades</li>
            <li>• Sé honesto y muestra cómo trabajas en ello</li>
            <li>• Ejemplo: "Me cuesta recordar detalles de reuniones, por eso siempre tomo notas detalladas"</li>
          </ul>
        </SectionCard>
      </div>
    </div>

    {/* Preguntas para hacer */}
    <div>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Lightbulb className="text-amber-400" size={20} />
        Preguntas para hacer al final
      </h3>
      <p className="text-dark-400 mb-4">
        Hacer buenas preguntas demuestra interés genuino y puede diferenciarte de otros candidatos.
      </p>
      <div className="space-y-3">
        {questionsToAsk.map((category, idx) => (
          <Accordion key={idx} title={category.category} defaultOpen={idx === 0}>
            <ul className="space-y-2">
              {category.questions.map((q, qIdx) => (
                <li key={qIdx} className="flex items-start gap-2 text-dark-300">
                  <ChevronRight size={16} className="text-primary-400 flex-shrink-0 mt-0.5" />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </Accordion>
        ))}
      </div>
    </div>

    {/* Tips finales */}
    <div className="grid md:grid-cols-3 gap-4">
      <TipCard type="tip" title="Habla de TI">
        Evita "nosotros hicimos..." El entrevistador te evalúa a ti, no a tu equipo. 
        Usa "yo propuse...", "yo implementé...".
      </TipCard>
      <TipCard type="tip" title="Sé conciso">
        Limita los detalles irrelevantes. El entrevistador no conoce tu contexto, 
        así que solo menciona lo importante.
      </TipCard>
      <TipCard type="tip" title="Muestra liderazgo">
        Ser proactivo es muy valorado. Resalta momentos donde propusiste soluciones 
        o tomaste la iniciativa.
      </TipCard>
    </div>
  </div>
);

const CVSection: React.FC = () => (
  <div className="space-y-8">
    {/* Intro */}
    <SectionCard gradient>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
          <FileText className="text-primary-400" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">CV / Resume Optimizado</h3>
          <p className="text-dark-300">
            Tu CV es tu primera impresión. Un CV bien estructurado puede marcar la diferencia 
            entre ser ignorado y conseguir entrevistas en <span className="text-primary-400">Google, Amazon, 
            Spotify</span> y otras empresas top.
          </p>
        </div>
      </div>
    </SectionCard>

    {/* Reglas de oro */}
    <div>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Award className="text-amber-400" size={20} />
        Reglas de Oro
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: FileText, title: "1 página máximo", desc: "2 solo si tienes mucha experiencia relevante" },
          { icon: Users, title: "Sin fotografía", desc: "Excepto si es costumbre obligatoria en tu país" },
          { icon: Zap, title: "Diseño simple", desc: "Sin columnas complejas, gráficos ni adornos" },
          { icon: Target, title: "Adapta al puesto", desc: "Enfatiza experiencia relevante para cada oferta" },
          { icon: Globe, title: "Texto buscable", desc: "Verifica que el PDF permite copiar/buscar texto" },
          { icon: TrendingUp, title: "Enfócate en valor", desc: "Logros cuantificables > lista de tecnologías" },
        ].map((rule, idx) => (
          <SectionCard key={idx}>
            <div className="flex items-start gap-3">
              <rule.icon className="text-primary-400 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-medium text-white">{rule.title}</h4>
                <p className="text-dark-400 text-sm">{rule.desc}</p>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>

    {/* Estructura recomendada */}
    <div>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <BookOpen className="text-secondary-400" size={20} />
        Estructura Recomendada
      </h3>
      <div className="space-y-4">
        {cvSections.map((section, idx) => (
          <Accordion key={idx} title={section.title} icon={section.icon} defaultOpen={idx === 2}>
            <div className="space-y-3">
              <ul className="space-y-2">
                {section.tips.map((tip, tipIdx) => (
                  <li key={tipIdx} className="flex items-start gap-2 text-dark-300">
                    <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
              {section.example && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-sm text-dark-300">
                    <span className="text-green-400 font-medium">Ejemplo:</span> {section.example}
                  </p>
                </div>
              )}
            </div>
          </Accordion>
        ))}
      </div>
    </div>

    {/* Errores comunes */}
    <div>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <AlertTriangle className="text-red-400" size={20} />
        Errores Comunes a Evitar
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700">
              <th className="text-left py-3 px-4 text-red-400 font-medium">❌ Error</th>
              <th className="text-left py-3 px-4 text-green-400 font-medium">✅ Solución</th>
            </tr>
          </thead>
          <tbody>
            {cvMistakes.map((item, idx) => (
              <tr key={idx} className="border-b border-dark-700/50">
                <td className="py-3 px-4 text-dark-300">{item.mistake}</td>
                <td className="py-3 px-4 text-dark-300">{item.fix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Ejemplo de descripción de experiencia */}
    <div>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Briefcase className="text-primary-400" size={20} />
        Cómo describir tu experiencia
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard>
          <h4 className="text-red-400 font-medium mb-3 flex items-center gap-2">
            <AlertTriangle size={18} />
            ❌ Mal ejemplo
          </h4>
          <p className="text-dark-400 text-sm italic">
            "Trabajé con React y Node.js en el equipo de desarrollo. Participamos en varios 
            proyectos y usamos metodologías ágiles."
          </p>
        </SectionCard>
        <SectionCard>
          <h4 className="text-green-400 font-medium mb-3 flex items-center gap-2">
            <CheckCircle size={18} />
            ✅ Buen ejemplo
          </h4>
          <p className="text-dark-400 text-sm italic">
            "Lideré la migración del frontend a React, reduciendo el tiempo de carga en un 60%. 
            Implementé un sistema de caché que disminuyó las llamadas a la API en un 40%."
          </p>
        </SectionCard>
      </div>
    </div>

    {/* Recursos */}
    <TipCard type="tip" title="Recursos útiles">
      <ul className="space-y-2 mt-2">
        <li className="flex items-center gap-2">
          <ExternalLink size={14} className="text-blue-400" />
          <span>r/cscareerquestions - Comunidad con feedback de CVs y consejos</span>
        </li>
        <li className="flex items-center gap-2">
          <Github size={14} className="text-blue-400" />
          <span>Plantillas LaTeX simples y profesionales en GitHub</span>
        </li>
      </ul>
    </TipCard>
  </div>
);

const PortfolioSection: React.FC = () => (
  <div className="space-y-8">
    {/* Intro */}
    <SectionCard gradient>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
          <FolderGit2 className="text-primary-400" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Portfolio de Proyectos</h3>
          <p className="text-dark-300">
            Si no tienes experiencia laboral o tus prácticas no resultaron en contratación, 
            un buen portfolio puede ser tu mejor carta de presentación. <span className="text-primary-400">Calidad 
            sobre cantidad</span>.
          </p>
        </div>
      </div>
    </SectionCard>

    {/* Cuándo es necesario */}
    <div>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Target className="text-amber-400" size={20} />
        ¿Cuándo necesitas un portfolio?
      </h3>
      <div className="grid md:grid-cols-3 gap-4">
        <SectionCard>
          <h4 className="text-green-400 font-medium mb-2">✅ Menos necesario si...</h4>
          <ul className="text-dark-400 text-sm space-y-1">
            <li>• Tienes experiencia laboral relevante</li>
            <li>• Hiciste prácticas y te contrataron</li>
            <li>• Tienes referencias sólidas</li>
          </ul>
        </SectionCard>
        <SectionCard>
          <h4 className="text-amber-400 font-medium mb-2">⚠️ Recomendable si...</h4>
          <ul className="text-dark-400 text-sm space-y-1">
            <li>• Eres recién graduado</li>
            <li>• Cambias de carrera a tech</li>
            <li>• Tu experiencia no es relevante para el puesto</li>
          </ul>
        </SectionCard>
        <SectionCard>
          <h4 className="text-red-400 font-medium mb-2">🔴 Muy necesario si...</h4>
          <ul className="text-dark-400 text-sm space-y-1">
            <li>• Eres autodidacta sin título</li>
            <li>• No tienes experiencia laboral</li>
            <li>• Buscas tu primer trabajo en tech</li>
          </ul>
        </SectionCard>
      </div>
    </div>

    {/* Qué priorizar */}
    <div>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Zap className="text-primary-400" size={20} />
        Qué priorizar en tus proyectos
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <TipCard type="success" title="Variedad tecnológica">
          Es mejor un proyecto que toque <strong>frontend + backend + base de datos + Docker</strong> 
          con 3 funcionalidades, que un frontend súper completo pero que no muestre otras habilidades.
        </TipCard>
        <TipCard type="success" title="Código de calidad">
          Las empresas valoran mucho las buenas prácticas: código limpio, tests, commits claros, 
          documentación. Un proyecto pequeño pero bien hecho impresiona más.
        </TipCard>
      </div>
    </div>

    {/* Checklist de un buen proyecto */}
    <div>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <CheckCircle className="text-green-400" size={20} />
        Checklist de un proyecto de calidad
      </h3>
      <SectionCard>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            "README claro con descripción y capturas",
            "Instrucciones de instalación y uso",
            "Código limpio y bien organizado",
            "Tests (unitarios y/o integración)",
            "Commits descriptivos y frecuentes",
            "Manejo de errores apropiado",
            "Variables de entorno para config sensible",
            "Docker para fácil despliegue (bonus)"
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-dark-300">
              <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>

    {/* Ideas de proyectos */}
    <div>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Lightbulb className="text-amber-400" size={20} />
        Ideas de proyectos
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {portfolioIdeas.map((idea, idx) => (
          <SectionCard key={idx}>
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-white">{idea.name}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${
                idea.difficulty === 'Principiante' ? 'bg-green-500/20 text-green-400' :
                idea.difficulty === 'Intermedio' ? 'bg-amber-500/20 text-amber-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {idea.difficulty}
              </span>
            </div>
            <p className="text-dark-400 text-sm mb-3">{idea.description}</p>
            <div className="flex flex-wrap gap-1">
              {idea.technologies.map((tech, techIdx) => (
                <span key={techIdx} className="text-xs bg-dark-700 text-dark-300 px-2 py-1 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>

    {/* Open Source */}
    <TipCard type="tip" title="Contribuir a Open Source">
      Otra forma de mostrar tus habilidades es contribuir a proyectos open source. 
      Ve a GitHub, busca repositorios en tu tecnología favorita con issues etiquetados 
      como "good first issue" y empieza a contribuir. Las empresas valoran mucho esto.
    </TipCard>

    {/* Resumen */}
    <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-xl p-6 border border-primary-500/20">
      <h4 className="text-white font-bold mb-3 flex items-center gap-2">
        <Star className="text-amber-400" size={20} />
        Recuerda: Calidad &gt; Cantidad
      </h4>
      <p className="text-dark-300">
        Un único proyecto bien hecho, con buenas prácticas, documentación clara y código limpio 
        vale más que 10 proyectos mediocres. Las empresas quieren ver que sabes trabajar como 
        un profesional, no que puedes hacer muchos tutoriales.
      </p>
    </div>
  </div>
);

const ApplicationsSection: React.FC = () => (
  <div className="space-y-8">
    {/* Intro */}
    <SectionCard gradient>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
          <Send className="text-primary-400" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Estrategias para Aplicar</h3>
          <p className="text-dark-300">
            Lo más normal es que la mayoría de empresas te rechacen o ignoren. 
            <span className="text-primary-400"> No te frustres</span>, nos pasa a todos. 
            La clave está en aplicar de forma estratégica y en volumen.
          </p>
        </div>
      </div>
    </SectionCard>

    {/* Estrategias principales */}
    <div className="space-y-4">
      {applicationStrategies.map((strategy, idx) => (
        <SectionCard key={idx}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
              <strategy.icon className="text-primary-400" size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-2">{strategy.title}</h4>
              <p className="text-dark-400 text-sm mb-3">{strategy.description}</p>
              <ul className="space-y-1">
                {strategy.tips.map((tip, tipIdx) => (
                  <li key={tipIdx} className="flex items-start gap-2 text-dark-300 text-sm">
                    <ChevronRight size={14} className="text-primary-400 flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>
      ))}
    </div>

    {/* Timeline típico */}
    <div>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="text-secondary-400" size={20} />
        Timeline típico de búsqueda
      </h3>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-dark-700"></div>
        <div className="space-y-6">
          {[
            { week: "Semana 1-2", title: "Preparación", desc: "Optimiza CV, LinkedIn, portfolio. Crea lista de empresas target." },
            { week: "Semana 3-4", title: "Aplicaciones masivas", desc: "Aplica a 50+ ofertas. Usa portales de empresas + LinkedIn." },
            { week: "Semana 5-8", title: "Primeras entrevistas", desc: "Entrevistas iniciales/screening. Practica respuestas conductuales." },
            { week: "Semana 8-12", title: "Entrevistas técnicas", desc: "Preparación intensiva de algoritmos. Usa todo el tiempo que te den." },
            { week: "Semana 12+", title: "Ofertas y negociación", desc: "Evalúa ofertas, negocia salario y beneficios." },
          ].map((item, idx) => (
            <div key={idx} className="relative pl-10">
              <div className="absolute left-2.5 w-3 h-3 rounded-full bg-primary-500 border-2 border-dark-900"></div>
              <div className="bg-dark-800/50 rounded-lg p-4 border border-dark-700">
                <span className="text-primary-400 text-sm font-medium">{item.week}</span>
                <h4 className="text-white font-medium mt-1">{item.title}</h4>
                <p className="text-dark-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* LinkedIn tips */}
    <div>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Linkedin className="text-blue-400" size={20} />
        Optimiza tu LinkedIn
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard>
          <h4 className="text-white font-medium mb-3">Perfil efectivo</h4>
          <ul className="space-y-2 text-dark-300 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
              <span>Foto profesional y friendly</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
              <span>Headline con keywords de tu rol ideal</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
              <span>About section con tu historia y objetivos</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
              <span>Experiencia detallada como en el CV</span>
            </li>
          </ul>
        </SectionCard>
        <SectionCard>
          <h4 className="text-white font-medium mb-3">Acciones proactivas</h4>
          <ul className="space-y-2 text-dark-300 text-sm">
            <li className="flex items-start gap-2">
              <Zap size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <span>Activa "Open to Work" (visible solo a recruiters)</span>
            </li>
            <li className="flex items-start gap-2">
              <Zap size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <span>Conecta con recruiters de empresas target</span>
            </li>
            <li className="flex items-start gap-2">
              <Zap size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <span>Pide referrals a empleados actuales</span>
            </li>
            <li className="flex items-start gap-2">
              <Zap size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <span>Publica contenido técnico ocasionalmente</span>
            </li>
          </ul>
        </SectionCard>
      </div>
    </div>

    {/* Inglés */}
    <TipCard type="warning" title="El inglés abre puertas">
      Dominar inglés (al menos conversacional) te abre muchísimas más oportunidades que 
      ser un excelente programador. Empresas remotas internacionales, relocation a otros 
      países, mejores salarios... Si puedes, invierte en mejorar tu inglés.
    </TipCard>

    {/* Mentalidad */}
    <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-6 border border-green-500/20">
      <h4 className="text-white font-bold mb-3 flex items-center gap-2">
        <Heart className="text-red-400" size={20} />
        Mantén la perspectiva
      </h4>
      <p className="text-dark-300">
        El rechazo es parte normal del proceso. Incluso con un excelente CV y preparación, 
        la mayoría de aplicaciones no resultarán en entrevistas. <span className="text-white">La diferencia 
        está en la persistencia</span>. Cada rechazo te acerca a tu próxima oportunidad. 
        Sigue aplicando, sigue mejorando, y los resultados llegarán.
      </p>
    </div>
  </div>
);

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const CareerTipsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('interviews');

  const renderContent = () => {
    switch (activeTab) {
      case 'interviews':
        return <InterviewsSection />;
      case 'cv':
        return <CVSection />;
      case 'portfolio':
        return <PortfolioSection />;
      case 'applications':
        return <ApplicationsSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-dark-800 to-dark-900 border-b border-dark-700">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Briefcase size={16} />
              Guía Completa de Carrera
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Consigue el trabajo de tus sueños
            </h1>
            <p className="text-xl text-dark-300 max-w-2xl mx-auto">
              Todo lo que necesitas saber sobre entrevistas, CV, portfolio y estrategias 
              para conseguir trabajo en las mejores empresas tech.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="sticky top-16 z-40 bg-dark-900/95 backdrop-blur-sm border-b border-dark-700">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap
                  border-b-2 transition-all duration-200
                  ${activeTab === tab.id
                    ? 'text-primary-400 border-primary-400 bg-primary-500/5'
                    : 'text-dark-400 border-transparent hover:text-white hover:bg-dark-800/50'
                  }
                `}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Description */}
      <div className="bg-dark-800/30 border-b border-dark-700">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-dark-400">
            {tabs.find(t => t.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-2 shadow-xl">
          <div className="flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  p-2 rounded-lg transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-dark-400 hover:text-white hover:bg-dark-700'
                  }
                `}
                title={tab.label}
              >
                <tab.icon size={20} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerTipsPage;
