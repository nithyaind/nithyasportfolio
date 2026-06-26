const portfolioItems = [
  // ==========================================
  // --- THE CURATED TOP 6 PROJECTS -----------
  // ==========================================
  {
    id: "tonys-kitchen",
    title: "Tony's Kitchen Lab",
    category: "multimedia",
    type: "image",
    src: "assets/img/tonys-lab.gif",
    // Foreground, left-aligned, close-up depth layer
    x: -28, y: -15, z: -150,
    actionType: "page",
    redirectUrl: "https://food-for-thought-six.vercel.app/",
    description: "<p>An immersive, responsive storytelling experience combining text, film, and interactive game elements.</p><p>Built entirely with vanilla architecture and hosted on Vercel.</p>"
  },
  {
    id: "sso-fidelity",
    title: "Security and SWE Internship @ Fidelity Investments",
    category: "tech",
    type: "image",
    src: "assets/img/fidelity.png",
    // Mid-ground, deep left side, mid-depth layer
    x: -35, y: 5, z: -250,
    actionType: "panel",
    description: "<p>Architected scalable access patterns for a single sign-on team within a customer protection center of excellence.</p><p>Focused on optimizing identity verification workflows and secure user sessions.</p>"
  },
  {
    id: "media-ethics-study",
    title: "AI & Media Ethics Registry",
    category: "multimedia",
    type: "image",
    src: "assets/images/ethics-study.png",
    // Foreground, right-aligned, close-up depth layer
    x: 32, y: -20, z: -120,
    actionType: "panel",
    description: "<p>A critical research initiative tracking the shifting frameworks of trust, generative media tools, and community literacy in localized journalism.</p>"
  },
  {
    id: "journalism-award",
    title: "AI Ethics Journalism Prize",
    category: "achievement",
    type: "image",
    src: "assets/objects/trophy.png",
    // Lower mid-ground, right side, mid-depth layer
    x: 24, y: 18, z: -280,
    actionType: "panel",
    description: "<p>Won second place in a multimedia journalism competition for integrating ethical AI components into investigative reporting workflows.</p>"
  },
  {
    id: "converge-con",
    title: "ConvergeCon 2026",
    category: "tech",
    type: "image",
    src: "assets/img/photo-journalism.png",
    // Background tunnel layer, left-center position
    x: -12, y: -22, z: -380,
    actionType: "panel",
    description: "<p>Assisted in hosting and developing platform modules for ConvergeCon to raise technological and media literacy across the community.</p>"
  },
  {
    id: "since-2020",
    title: "Since 20/20",
    category: "multimedia",
    type: "image",
    src: "assets/img/since-2020.jpg", 
    // Mid-ground, central-right position, mid-depth layer
    x: 12, y: 10, z: -200,
    actionType: "page",
    redirectUrl: "https://light-drab-psi.vercel.app/",
    description: "<p></p>"
  },

  // ==========================================
  // --- NAVIGATION DESTINATIONS (7 & 8) ------
  // ==========================================
  {
    id: "project-archive",
    title: "The Project Archive",
    category: "all", 
    type: "link-node",
    src: "assets/objects/archive-folder.png", 
    // Positioned distinctly lower left, framing the bottom edge
    x: -40, y: 28, z: -180,
    actionType: "page",
    redirectUrl: "/archive.html",
    description: "Click to open the deep storage log of past experiments, drafts, music, and side-quests."
  },
  {
    id: "about-me",
    title: "All About Me",
    category: "all",
    type: "link-node",
    src: "assets/objects/profile-avatar.png", 
    // Positioned opposite the archive lower right, framing the bottom edge
    x: 40, y: 28, z: -180,
    actionType: "page",
    redirectUrl: "/aboutme.html",
    description: "Click to see who is behind the curtain—background, resume, and creative philosophies."
  }
];