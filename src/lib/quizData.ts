export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: "rsa" | "shor" | "pqc";
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question:
      "What mathematical problem does RSA encryption rely on for its security?",
    options: [
      "Discrete logarithm problem",
      "Integer factorization of large semiprimes",
      "Elliptic curve point multiplication",
      "Shortest vector problem in lattices",
    ],
    correctIndex: 1,
    explanation:
      "RSA security depends on the difficulty of factoring the product of two large prime numbers. Classical computers cannot efficiently factor large semiprimes, which is what makes RSA secure today.",
    topic: "rsa",
  },
  {
    id: 2,
    question: "What does Shor's algorithm efficiently solve on a quantum computer?",
    options: [
      "Finding shortest paths in graphs",
      "Searching unsorted databases",
      "Integer factorization and discrete logarithms",
      "Solving NP-complete problems",
    ],
    correctIndex: 2,
    explanation:
      "Shor's algorithm can factor integers and compute discrete logarithms in polynomial time on a quantum computer, breaking RSA and many other public-key cryptosystems.",
    topic: "shor",
  },
  {
    id: 3,
    question:
      "Approximately how many logical qubits are estimated to break RSA-2048?",
    options: [
      "About 100 qubits",
      "About 1,000 qubits",
      "About 4,000 qubits",
      "About 1,000,000 qubits",
    ],
    correctIndex: 2,
    explanation:
      "Current research estimates that roughly 4,000 error-corrected logical qubits would be needed to factor a 2048-bit RSA key using Shor's algorithm, though physical qubit requirements are much higher due to error correction overhead.",
    topic: "shor",
  },
  {
    id: 4,
    question: "What is ML-KEM (formerly CRYSTALS-Kyber)?",
    options: [
      "A quantum computing programming language",
      "A NIST-standardized post-quantum key encapsulation mechanism",
      "A classical symmetric encryption algorithm",
      "A quantum error correction code",
    ],
    correctIndex: 1,
    explanation:
      "ML-KEM (Module-Lattice-Based Key Encapsulation Mechanism), standardized as FIPS 203 in August 2024, is a post-quantum key encapsulation mechanism based on the hardness of lattice problems.",
    topic: "pqc",
  },
  {
    id: 5,
    question:
      "Why are lattice-based cryptographic schemes considered quantum-resistant?",
    options: [
      "They use quantum entanglement for key exchange",
      "No known quantum algorithm can efficiently solve lattice problems like SVP",
      "They require more qubits than will ever be built",
      "They are based on one-time pads which are information-theoretically secure",
    ],
    correctIndex: 1,
    explanation:
      "Lattice-based schemes rely on problems like the Shortest Vector Problem (SVP) and Learning With Errors (LWE). No known quantum algorithm, including Shor's, can efficiently solve these problems.",
    topic: "pqc",
  },
  {
    id: 6,
    question: 'What is a "harvest now, decrypt later" attack?',
    options: [
      "Stealing encryption keys from quantum computers",
      "Capturing encrypted data today to decrypt it once quantum computers are available",
      "Using quantum computers to break real-time communications",
      "A brute-force attack that runs overnight",
    ],
    correctIndex: 1,
    explanation:
      'Adversaries can record encrypted traffic today and store it until sufficiently powerful quantum computers exist to decrypt it. This "harvest now, decrypt later" threat is why migrating to post-quantum cryptography is urgent even before large-scale quantum computers are built.',
    topic: "rsa",
  },
  {
    id: 7,
    question:
      "Which quantum phenomenon does Shor's algorithm exploit to find the period of a function?",
    options: [
      "Quantum tunneling",
      "Quantum superposition and interference via the Quantum Fourier Transform",
      "Quantum entanglement swapping",
      "Quantum decoherence",
    ],
    correctIndex: 1,
    explanation:
      "Shor's algorithm uses superposition to evaluate a function at many inputs simultaneously, then applies the Quantum Fourier Transform (QFT) to extract the period through constructive and destructive interference.",
    topic: "shor",
  },
  {
    id: 8,
    question:
      "What NIST process led to the standardization of post-quantum cryptographic algorithms?",
    options: [
      "The Quantum Computing Initiative of 2015",
      "The Post-Quantum Cryptography Standardization Project started in 2016",
      "The Advanced Encryption Standard competition",
      "The SHA-3 hash function competition",
    ],
    correctIndex: 1,
    explanation:
      "NIST began its Post-Quantum Cryptography Standardization Project in 2016, evaluating submissions over multiple rounds. The first standards (FIPS 203, 204, 205) were published in August 2024.",
    topic: "pqc",
  },
];
