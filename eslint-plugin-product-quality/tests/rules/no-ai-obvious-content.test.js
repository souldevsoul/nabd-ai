/**
 * Tests for no-ai-obvious-content rule
 */
const { RuleTester } = require('eslint');
const rule = require('../../rules/no-ai-obvious-content');

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
});

ruleTester.run('no-ai-obvious-content', rule, {
  valid: [
    // Short texts should be skipped
    {
      code: '<p>Welcome to our platform</p>',
      filename: 'page.tsx',
    },

    // Human-written content with specifics and numbers
    {
      code: `
        <div>
          We've processed over 47,000 logos since launching in March 2023.
          Our average customer saves $890 compared to hiring a traditional designer.
          The tool uses GPT-4 Vision to analyze your brand guidelines and generates
          12 variations in about 90 seconds. We're based in Austin, and yeah,
          the name came from a typo in our first pitch deck that we decided to keep.
        </div>
      `,
      filename: 'page.tsx',
    },

    // Technical content with real details
    {
      code: `
        const feature = {
          description: "Built with Next.js 14 and React Server Components. We're using Vercel's edge runtime for the API endpoints, which cut our response times from 340ms to 89ms. The image processing runs on Cloudflare R2 because S3 was costing us $340/month."
        };
      `,
      filename: 'about.tsx',
    },

    // Non-checked page (should be ignored)
    {
      code: `
        <div>
          Our revolutionary platform leverages cutting-edge technology to transform
          your business with innovative solutions that empower teams to unlock
          unprecedented growth through seamless integration of next-generation tools.
        </div>
      `,
      filename: 'dashboard/settings.tsx',
    },

    // Real customer story with personality
    {
      code: `
        const testimonial = {
          content: "Honestly didn't expect much, but damn - this thing cranked out 8 solid logo concepts in like 2 minutes. We picked #3, tweaked the colors a bit, and shipped it. Saved us probably $1,200 and 3 weeks vs our usual process."
        };
      `,
      filename: 'page.tsx',
    },

    // Content with low AI score (threshold not reached)
    {
      code: `
        <p>
          Our platform helps designers create professional logos faster.
          You can customize colors, fonts, and layouts to match your brand.
          The interface is simple and works on mobile devices too.
        </p>
      `,
      filename: 'landing.tsx',
    },
  ],

  invalid: [
    // High buzzword density
    {
      code: `
        <div>
          Our innovative platform leverages cutting-edge technology to deliver
          seamless experiences that empower businesses to unlock their potential
          through revolutionary solutions. We're transforming the industry with
          groundbreaking features that streamline workflows and optimize productivity.
        </div>
      `,
      filename: 'page.tsx',
      errors: 1, // Will trigger at least one error
    },

    // Generic marketing phrases (needs to be longer to meet 100 char minimum)
    {
      code: `
        <p>
          In today's fast-paced business environment, our team of experienced
          professionals is committed to excellence. We pride ourselves on delivering
          exceptional service to our valued customers with innovative solutions.
          With a proven track record and years of experience in the industry,
          we're dedicated to providing industry-leading, state-of-the-art solutions
          that are tailored to your specific needs and business requirements.
        </p>
      `,
      filename: 'about.tsx',
      errors: 1, // Will trigger at least one error
    },

    // Perfect list of 5 items (AI pattern) with enough buzzwords
    {
      code: `
        <div>
          Our comprehensive platform delivers revolutionary solutions for businesses:
          1. Streamline your workflow with cutting-edge automation tools
          2. Leverage powerful analytics to optimize performance metrics
          3. Transform customer engagement with innovative communication tools
          4. Empower your team with seamless collaboration features
          5. Unlock growth potential through data-driven insights
        </div>
      `,
      filename: 'landing.tsx',
      errors: 1, // List pattern + buzzwords
    },

    // High buzzword density (separate check)
    {
      code: `
        <p>
          Leverage our innovative platform to optimize and streamline your
          cutting-edge workflows. Unlock transformative results through
          revolutionary technology that empowers seamless integration.
        </p>
      `,
      filename: 'page.tsx',
      errors: 1, // High buzzword density
    },

    // Custom threshold test (lower threshold should trigger) - expect both errors
    {
      code: `
        <div>
          Our platform leverages innovative technology to deliver seamless
          solutions that empower users to optimize their workflows and
          streamline operations efficiently with cutting-edge tools.
        </div>
      `,
      filename: 'page.tsx',
      options: [{ threshold: 5 }],
      errors: 2, // Lower threshold + buzzword density = 2 errors
    },
  ],
});

console.log('✅ no-ai-obvious-content: All tests passed');
