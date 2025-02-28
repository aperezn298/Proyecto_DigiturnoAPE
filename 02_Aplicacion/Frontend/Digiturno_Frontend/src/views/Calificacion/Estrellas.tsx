import { Star } from 'lucide-react';
import { Tooltip } from '@nextui-org/react';

const Rating = ({ rating, setRating }: any) => {

    const handleRatingChange = (value: number) => {
        setRating(value);
    };

    const renderStars = () => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            const isFullStar = i <= rating;
            stars.push(
                <Tooltip key={i} content={`${i} Estrella${i > 1 ? 's' : ''}`}>
                    <button onClick={() => handleRatingChange(i)} className="p-0 min-w-0 mr-2 cursor-pointer transition-transform transform hover:scale-110">
                        {isFullStar ? (
                            <Star size={30} fill='#FFBE30' strokeWidth={0} />
                        ) : (
                            <Star size={30} className="text-gray-300" />
                        )}
                    </button>
                </Tooltip>
            );
        }
        return stars;
    };

    return (
        <div className="flex items-center place-self-center">
            {renderStars()}
        </div>
    );
};

export default Rating;
