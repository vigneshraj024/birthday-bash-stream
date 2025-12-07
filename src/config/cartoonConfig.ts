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
        name: 'Motu',
        image: '/cartoons/motu.png',
        description: 'Fun cartoon friend Motu',
    },
    {
        id: 'rudraa',
        name: 'Rudraa',
        image: '/cartoons/rudraa.png',
        description: 'Rudraa cartoon avatar',
    },
    {
        id: 'doremon',
        name: 'Doremon',
        image: '/doraemon.png',
        description: 'Doremon cartoon friend',
    },
];

export function getCartoonById(id: string): CartoonCharacter | undefined {
    return cartoons.find(cartoon => cartoon.id === id);
}
