
import React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { cn } from '../lib/utils';
import { useAppContext } from '../context/AppContext';

const modes = [
  { value: 'kids', label: 'Kids Edition' },
  { value: 'novice', label: 'Novice' },
  { value: 'knowledge', label: 'Gaining Knowledge' },
  { value: 'expert', label: 'Expert Scientist' },
];

const ModeSelector: React.FC = () => {
  const { userMode, setUserMode } = useAppContext();
  const [open, setOpen] = React.useState(false);

  const selectedMode = modes.find(mode => mode.value === userMode);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-48 justify-between transition-all duration-300 hover:border-primary hover:text-primary"
        >
          {selectedMode?.label || 'Select mode...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <Command>
          <CommandInput placeholder="Search mode..." />
          <CommandEmpty>No mode found.</CommandEmpty>
          <CommandGroup>
            {modes.map((mode) => (
              <CommandItem
                key={mode.value}
                value={mode.value}
                onSelect={() => {
                  setUserMode(mode.value as any);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    userMode === mode.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {mode.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ModeSelector;
