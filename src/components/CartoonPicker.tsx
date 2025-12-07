import { useState } from 'react';
import { Check } from 'lucide-react';
import { cartoons, type CartoonCharacter } from '@/config/cartoonConfig';

interface CartoonPickerProps {
    selectedCartoonId: string | null;
    onSelect: (cartoonId: string) => void;
}

export function CartoonPicker({ selectedCartoonId, onSelect }: CartoonPickerProps) {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cartoons.map((cartoon) => (
                    <button
                        key={cartoon.id}
                        type="button"
                        onClick={() => onSelect(cartoon.id)}
                        className={`relative group rounded-xl overflow-hidden border-2 transition-all ${selectedCartoonId === cartoon.id
                                ? 'border-primary ring-2 ring-primary/20 scale-[1.02]'
                                : 'border-border hover:border-primary/50 hover:scale-[1.01]'
                            }`}
                    >
                        {/* Cartoon Image */}
                        <div className="aspect-square bg-muted/50 p-2">
                            <img
                                src={cartoon.image}
                                alt={cartoon.name}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Cartoon Name */}
                        <div className={`p-2 text-center text-sm font-medium transition-colors ${selectedCartoonId === cartoon.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-card group-hover:bg-accent'
                            }`}>
                            {cartoon.name}
                        </div>

                        {/* Selected Indicator */}
                        {selectedCartoonId === cartoon.id && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
                                <Check className="w-4 h-4 text-primary-foreground" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
