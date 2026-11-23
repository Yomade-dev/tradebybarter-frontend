// import React from 'react';
// import { Container } from 'react-bootstrap';
// import '../css/About.css';
// import ancientImg from "../assets/ancient img.jpeg";

// const About = () => {
//   return (
//     <div
//       className="about-page"
//       style={{ backgroundImage: `url(${ancientImg})` }}
//     >
//       <div className="about-overlay"></div>

//       <Container className="about-content">
//         <div className="about-title-glass">
//           <h1 className="about-title">The Story Behind Trade By Barter</h1>
//         </div>

//         <div className="about-grid">
//           <div className="about-glass-card">
//             <h2>Before Money, There Was Trade</h2>
//             <p>
//               Long before coins and paper currency found their way into West
//               African commerce, communities across the continent ran on a
//               simple but powerful idea: if you have what I need, and I have
//               what you need, we don't need anything else to make a deal.
//             </p>
//           </div>

//           <div className="about-glass-card">
//             <h2>Barter in Yorubaland</h2>
//             <p>
//               In Yoruba communities, the marketplace — the <em>Oja</em> — was
//               never just a place to buy and sell. It was the heartbeat of the
//               town, where farmers, weavers, blacksmiths, and potters traded
//               goods long before cowry shells became common currency.
//             </p>
//           </div>

//           <div className="about-glass-card">
//             <h2>A Social Art</h2>
//             <p>
//               Trade wasn't just transactional — it was social. Haggling in
//               the market was an art form, a conversation, often a display of
//               wit and relationship-building between buyer and seller.
//             </p>
//           </div>

//           <div className="about-glass-card">
//             <h2>Why We Built This</h2>
//             <p>
//               TradeByBarter exists to bring that same spirit — direct,
//               trust-based, mutually beneficial exchange — into a modern,
//               digital space. Swap. Trade. Get what you need.
//             </p>
//           </div>
//         </div>
//       </Container>
//     </div>
//   );
// };

// export default About;

import React from 'react';
import { Container } from 'react-bootstrap';
import '../css/About.css';
import ancientImg from "../assets/ancient img.jpeg";

const About = () => {
  return (
    <div
      className="about-page"
      style={{ '--about-bg-image': `url(${ancientImg})` }}
    >
      <div className="about-overlay"></div>

      <Container className="about-content">
        <div className="about-title-glass">
          <h1 className="about-title">The Story Behind Trade By Barter</h1>
        </div>

        <div className="about-grid">
          <div className="about-glass-card">
            <h2>Before Money, There Was Trade</h2>
            <p>
              Long before coins and paper currency found their way into West
              African commerce, communities across the continent ran on a
              simple but powerful idea: if you have what I need, and I have
              what you need, we don't need anything else to make a deal.
            </p>
          </div>

          <div className="about-glass-card">
            <h2>Barter in Yorubaland</h2>
            <p>
              In Yoruba communities, the marketplace — the <em>Oja</em> — was
              never just a place to buy and sell. It was the heartbeat of the
              town, where farmers, weavers, blacksmiths, and potters traded
              goods long before cowry shells became common currency.
            </p>
          </div>

          <div className="about-glass-card">
            <h2>A Social Art</h2>
            <p>
              Trade wasn't just transactional — it was social. Haggling in
              the market was an art form, a conversation, often a display of
              wit and relationship-building between buyer and seller.
            </p>
          </div>

          <div className="about-glass-card">
            <h2>Why We Built This</h2>
            <p>
              TradeByBarter exists to bring that same spirit — direct,
              trust-based, mutually beneficial exchange — into a modern,
              digital space. Swap. Trade. Get what you need.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default About;