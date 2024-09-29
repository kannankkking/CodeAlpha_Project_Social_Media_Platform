import React from 'react';
import { cardData } from "../../assets/cardData";
import Card from './Card';

const CardSection = () => {
    return (
        <div className="px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3  right-11 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-4 mb-10">
                {cardData.map((card) => (
                    <div key={card.id}>
                        <Card 
                            id={card.id} 
                            name={card.name} 
                            img={card.image} 
                            status={card.status} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CardSection;
