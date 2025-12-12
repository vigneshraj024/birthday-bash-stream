// Cartoon Character Configuration

export interface CartoonCharacter {
    id: string;
    name: string;
    image: string;
    description: string;
}

export const cartoons: CartoonCharacter[] = [
    {
        id: 'motu',
        name: 'Motu Patlu',
        image: '/cartoons/motu.png',
        description: 'Fun cartoon friend Motu',
    },
    {
        id: 'rudraa',
        name: 'Rudra',
        image: '/cartoons/rudraa.png',
        description: 'Rudra cartoon avatar',
    },
    {
        id: 'doremon',
        name: 'Doremon',
        image: '/cartoons/doremon.png',
        description: 'Doremon cartoon friend',
    },
    {
        id: 'character_guitar',
        name: 'Rock Star Buddy',
        image: '/cartoons/character_guitar.png',
        description: 'Energetic guitar-playing celebration character',
    },
    {
        id: 'character_friendly',
        name: 'Party Pal',
        image: '/cartoons/character_friendly.png',
        description: 'Friendly celebration companion',
    },
];

export function getCartoonById(id: string): CartoonCharacter | undefined {
    return cartoons.find(cartoon => cartoon.id === id);
}
