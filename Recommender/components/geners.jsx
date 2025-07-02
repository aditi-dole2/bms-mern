import { animated, useSpring } from '@react-spring/web';

const GenreButton = ({ genre, selected, onClick }) => {
  const spring = useSpring({
    scale: selected ? 1.05 : 1,
    rotateZ: selected ? 2 : 0,
    config: { tension: 1000, friction: 40 }
  });

  return (
    <animated.button
      key={genre.id}
      style={{
        ...spring,
        transform: spring.scale.to(s => `scale(${s}) rotate(${spring.rotateZ.get()}deg)`)
      }}
      className={`
        p-4 rounded-full cursor-pointer text-lg 
        transition-all duration-300 ease-in-out
        backdrop-blur-md relative
        ${selected 
          ? 'bg-purple-600/80 shadow-[0_0_15px_rgba(135,34,197,0.8)] text-white font-medium' 
          : 'bg-gray-800/50 hover:bg-gray-700/50'
        }
        before:absolute before:inset-0 before:rounded-full
        before:transition-opacity before:duration-300
        ${selected 
          ? 'before:bg-gradient-to-r before:from-purple-500/20 before:to-emerald-400/20 before:opacity-100' 
          : 'before:opacity-0'
        }
        hover:shadow-lg
        active:scale-95
      `}
      onClick={onClick}
    >
      {genre.name}

    </animated.button>
  );
};

export default function GenreGrid({ genres, selectedGenres, toggleGenre }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      {genres.map((genre) => (
        <GenreButton
          key={genre.name}
          genre={genre}
          selected={selectedGenres.has(genre.name)}
          onClick={() => toggleGenre(genre.name)}
        />
      ))}
    </div>
  );
}