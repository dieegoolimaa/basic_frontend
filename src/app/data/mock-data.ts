import { Course, HomeBanner } from '../models';

export const MOCK_COURSES: Course[] = [
    {
        _id: 'course-1',
        title: 'Expert em Fibra de Vidro',
        description: 'Domine a técnica mais pedida nos salões. Aprenda desde a preparação da unha natural até o acabamento perfeito com curvatura C. Neste curso completo você vai aprender todas as técnicas utilizadas pelas melhores profissionais do mercado.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',

        modules: [
            {
                title: 'Módulo 1: Fundamentos e Anatomia',
                lessons: [
                    {
                        title: 'Bem-vinda ao Curso',
                        duration: '05:00',
                        completed: false,
                        contentType: 'video',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        isMandatory: true,
                        content: '<h3>Olá, futura especialista!</h3><p>Seja muito bem-vinda ao nosso curso de Fibra de Vidro. Prepare-se para uma jornada transformadora na sua carreira!</p>'
                    },
                    {
                        title: 'Anatomia da Unha Natural',
                        duration: '15:00',
                        completed: false,
                        contentType: 'text',
                        isMandatory: true,
                        content: `<h2>A Estrutura da Unha</h2>
<p>A unha é composta por várias partes importantes que você precisa conhecer para realizar um trabalho seguro e profissional:</p>
<h4>1. Matriz Ungueal</h4>
<p>Localizada na base da unha, sob a cutícula. É onde as células se multiplicam e formam a lâmina ungueal. Danos à matriz podem causar deformidades permanentes.</p>
<h4>2. Lâmina Ungueal</h4>
<p>É a parte visível da unha, composta por queratina. Possui três camadas que conferem resistência e flexibilidade.</p>
<h4>3. Leito Ungueal</h4>
<p>Tecido vascularizado sob a lâmina. É responsável pela cor rosada da unha saudável.</p>
<h4>4. Cutícula e Eponíquio</h4>
<p>A cutícula é o tecido morto aderido à lâmina. O eponíquio é a pele viva que deve ser preservada para evitar infecções.</p>
<h4>5. Hiponíquio</h4>
<p>Selamento entre a borda livre e o leito. Sua preservação previne infecções fúngicas.</p>`
                    },
                    {
                        title: 'Materiais Necessários',
                        duration: '12:00',
                        completed: false,
                        contentType: 'mixed',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        isMandatory: true,
                        content: '<p>Nesta aula você aprenderá sobre todos os materiais e ferramentas necessárias para trabalhar com fibra de vidro.</p>',
                        steps: [
                            { id: 's1', text: 'Lixa 100/180 para preparação', isCompleted: false },
                            { id: 's2', text: 'Primer ácido ou não-ácido', isCompleted: false },
                            { id: 's3', text: 'Gel construtor (clear ou camuflagem)', isCompleted: false },
                            { id: 's4', text: 'Fibra de vidro em malha ou fio', isCompleted: false },
                            { id: 's5', text: 'Pincel de fibra de vidro', isCompleted: false },
                            { id: 's6', text: 'Cabine LED/UV 48W', isCompleted: false },
                            { id: 's7', text: 'Top coat sem goma', isCompleted: false }
                        ]
                    },
                    {
                        title: 'Quiz - Módulo 1',
                        duration: '10:00',
                        completed: false,
                        contentType: 'quiz',
                        isMandatory: true,
                        quiz: {
                            minPassScore: 70,
                            questions: [
                                { id: 'q1', question: 'Onde está localizada a matriz ungueal?', options: ['Na ponta da unha', 'Na base, sob a cutícula', 'No leito ungueal'], correctOptionIndex: 1 },
                                { id: 'q2', question: 'Qual estrutura NÃO deve ser cortada durante a manicure?', options: ['Cutícula morta', 'Eponíquio', 'Lâmina ungueal'], correctOptionIndex: 1 },
                                { id: 'q3', question: 'A lâmina ungueal é composta principalmente de:', options: ['Colágeno', 'Queratina', 'Elastina'], correctOptionIndex: 1 }
                            ]
                        }
                    }
                ]
            },
            {
                title: 'Módulo 2: Preparação da Unha',
                lessons: [
                    {
                        title: 'Higienização e Assepsia',
                        duration: '18:00',
                        completed: false,
                        contentType: 'video',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        isMandatory: true
                    },
                    {
                        title: 'Remoção Segura da Cutícula',
                        duration: '25:00',
                        completed: false,
                        contentType: 'mixed',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        isMandatory: true,
                        content: '<p>Técnica de remoção a seco para preparação perfeita da área de aplicação.</p>',
                        steps: [
                            { id: 's1', text: 'Empurrar cutícula com espátula metálica', isCompleted: false },
                            { id: 's2', text: 'Identificar cutícula morta x eponíquio', isCompleted: false },
                            { id: 's3', text: 'Utilizar alicate com corte preciso', isCompleted: false },
                            { id: 's4', text: 'Verificar sangramento (parar se houver)', isCompleted: false }
                        ]
                    },
                    {
                        title: 'Lixamento e Primer',
                        duration: '20:00',
                        completed: false,
                        contentType: 'mixed',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        content: '<p>O lixamento correto garante aderência perfeita sem danificar a unha natural.</p>',
                        steps: [
                            { id: 's1', text: 'Lixar toda superfície com lixa 180', isCompleted: false },
                            { id: 's2', text: 'Remover pó com escovinha', isCompleted: false },
                            { id: 's3', text: 'Aplicar desidratador', isCompleted: false },
                            { id: 's4', text: 'Aplicar primer (esperar secar 60s)', isCompleted: false }
                        ]
                    }
                ]
            },
            {
                title: 'Módulo 3: Aplicação da Fibra',
                lessons: [
                    {
                        title: 'Corte e Posicionamento da Fibra',
                        duration: '22:00',
                        completed: false,
                        contentType: 'video',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        isMandatory: true
                    },
                    {
                        title: 'Encapsulamento com Gel',
                        duration: '30:00',
                        completed: false,
                        contentType: 'mixed',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        content: '<p>A técnica de encapsulamento é o segredo para uma fibra durável e resistente.</p>',
                        steps: [
                            { id: 's1', text: 'Aplicar camada fina de gel base', isCompleted: false },
                            { id: 's2', text: 'Posicionar fibra a 1mm da cutícula', isCompleted: false },
                            { id: 's3', text: 'Curar por 30s', isCompleted: false },
                            { id: 's4', text: 'Aplicar gel construtor', isCompleted: false },
                            { id: 's5', text: 'Criar ponto de tensão (apex)', isCompleted: false },
                            { id: 's6', text: 'Curar por 60s', isCompleted: false }
                        ]
                    },
                    {
                        title: 'Curvatura C Perfeita',
                        duration: '25:00',
                        completed: false,
                        contentType: 'video',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
                    },
                    {
                        title: 'Quiz - Técnica de Aplicação',
                        duration: '08:00',
                        completed: false,
                        contentType: 'quiz',
                        isMandatory: true,
                        quiz: {
                            minPassScore: 70,
                            questions: [
                                { id: 'q1', question: 'A que distância da cutícula deve ficar a fibra?', options: ['0mm (encostar)', '1mm', '5mm'], correctOptionIndex: 1 },
                                { id: 'q2', question: 'O que é o apex (ponto de tensão)?', options: ['A ponta da unha', 'O ponto mais alto da curvatura', 'A base da unha'], correctOptionIndex: 1 },
                                { id: 'q3', question: 'Tempo mínimo de cura do gel construtor:', options: ['30 segundos', '60 segundos', '120 segundos'], correctOptionIndex: 1 }
                            ]
                        }
                    }
                ]
            },
            {
                title: 'Módulo 4: Acabamento e Manutenção',
                lessons: [
                    {
                        title: 'Lixamento e Polimento Final',
                        duration: '20:00',
                        completed: false,
                        contentType: 'video',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
                    },
                    {
                        title: 'Aplicação do Top Coat',
                        duration: '10:00',
                        completed: false,
                        contentType: 'video',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
                    },
                    {
                        title: 'Manutenção a cada 21 dias',
                        duration: '35:00',
                        completed: false,
                        contentType: 'mixed',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        content: '<p>Aprenda a fazer manutenções que fidelizam suas clientes e garantem unhas sempre perfeitas.</p>',
                        steps: [
                            { id: 's1', text: 'Verificar descolamentos', isCompleted: false },
                            { id: 's2', text: 'Lixar área de crescimento', isCompleted: false },
                            { id: 's3', text: 'Reaplicar fibra na base', isCompleted: false },
                            { id: 's4', text: 'Nivelar toda unha', isCompleted: false },
                            { id: 's5', text: 'Finalizar com top coat', isCompleted: false }
                        ]
                    }
                ]
            }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: 'course-2',
        title: 'Nail Art 3D Avançada',
        description: 'Crie designs incríveis e aumente seu faturamento. Aprenda flores, pedrarias, relevos e técnicas artísticas que transformam unhas em verdadeiras obras de arte.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?auto=format&fit=crop&w=600&q=80',

        modules: [
            {
                title: 'Módulo 1: Introdução ao Nail Art',
                lessons: [
                    {
                        title: 'História e Tendências',
                        duration: '12:00',
                        completed: false,
                        contentType: 'text',
                        content: `<h2>A Arte nas Unhas</h2>
<p>O nail art surgiu no Japão nos anos 90 e revolucionou a indústria da beleza. Hoje, é uma das áreas mais lucrativas para profissionais de unhas.</p>
<h4>Tendências Atuais</h4>
<ul>
<li>Minimalismo sofisticado</li>
<li>Flores 3D realistas</li>
<li>Efeito cromo e espelhado</li>
<li>Texturas orgânicas</li>
<li>Aplicação de gemas e cristais</li>
</ul>`
                    },
                    {
                        title: 'Materiais para Nail Art',
                        duration: '15:00',
                        completed: false,
                        contentType: 'video',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
                    }
                ]
            },
            {
                title: 'Módulo 2: Técnicas Básicas',
                lessons: [
                    {
                        title: 'Pinceladas Fundamentais',
                        duration: '25:00',
                        completed: false,
                        contentType: 'video',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        isMandatory: true
                    },
                    {
                        title: 'Criando sua Primeira Rosa 3D',
                        duration: '40:00',
                        completed: false,
                        contentType: 'mixed',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        steps: [
                            { id: 's1', text: 'Preparar acrílico na consistência correta', isCompleted: false },
                            { id: 's2', text: 'Criar pétala central (botão)', isCompleted: false },
                            { id: 's3', text: 'Adicionar pétalas intermediárias', isCompleted: false },
                            { id: 's4', text: 'Finalizar com pétalas externas abertas', isCompleted: false },
                            { id: 's5', text: 'Adicionar folhas e detalhes', isCompleted: false }
                        ]
                    }
                ]
            }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: 'course-3',
        title: 'Esmaltação em Gel Perfeita',
        description: 'O segredo da esmaltação que não descasca. Aprenda técnicas de aplicação impecável, combinação de cores e cuidados que garantem durabilidade de até 30 dias.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1632922267756-9b71242b1592?auto=format&fit=crop&w=600&q=80',

        modules: [
            {
                title: 'Módulo 1: Fundamentos do Gel',
                lessons: [
                    {
                        title: 'Diferença entre Gel e Esmalte Comum',
                        duration: '10:00',
                        completed: false,
                        contentType: 'text',
                        content: `<h2>Por que Gel?</h2>
<p>O esmalte em gel oferece vantagens significativas sobre o esmalte tradicional:</p>
<ul>
<li><strong>Durabilidade:</strong> 2-4 semanas sem lascar</li>
<li><strong>Brilho:</strong> Efeito espelhado que não opaca</li>
<li><strong>Secagem:</strong> Instantânea sob luz UV/LED</li>
<li><strong>Resistência:</strong> Mais forte que esmalte comum</li>
</ul>`
                    },
                    {
                        title: 'Tipos de Gel e Suas Aplicações',
                        duration: '18:00',
                        completed: false,
                        contentType: 'video',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
                    }
                ]
            },
            {
                title: 'Módulo 2: Técnica de Aplicação',
                lessons: [
                    {
                        title: 'Preparação Perfeita',
                        duration: '20:00',
                        completed: false,
                        contentType: 'mixed',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        steps: [
                            { id: 's1', text: 'Lavar e higienizar as mãos', isCompleted: false },
                            { id: 's2', text: 'Empurrar cutículas', isCompleted: false },
                            { id: 's3', text: 'Lixar levemente a superfície', isCompleted: false },
                            { id: 's4', text: 'Remover oleosidade com prep', isCompleted: false },
                            { id: 's5', text: 'Aplicar primer (se necessário)', isCompleted: false }
                        ]
                    },
                    {
                        title: 'Aplicação do Gel - Passo a Passo',
                        duration: '30:00',
                        completed: false,
                        contentType: 'video',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        isMandatory: true
                    },
                    {
                        title: 'Selar as Bordas (Capping)',
                        duration: '15:00',
                        completed: false,
                        contentType: 'video',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
                    }
                ]
            }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

export const MOCK_BANNERS: HomeBanner[] = [
    {
        _id: 'b1',
        imageUrl: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1400&q=80',
        title: 'Transforme sua Carreira',
        subtitle: 'Aprenda com as melhores profissionais do mercado',
        active: true,
        createdAt: new Date('2024-01-01')
    },
    {
        _id: 'b2',
        imageUrl: 'https://images.unsplash.com/photo-1599693359686-caab568d9975?auto=format&fit=crop&w=1400&q=80',
        title: 'Curso de Fibra de Vidro',
        subtitle: 'Do básico ao avançado - Vagas Limitadas',
        active: true,
        createdAt: new Date('2024-02-01')
    },
    {
        _id: 'b3',
        imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1400&q=80',
        title: 'Nail Art 3D',
        subtitle: 'Técnicas exclusivas para se destacar',
        active: true,
        createdAt: new Date('2024-03-01')
    }
];
