import { Host, DropdownMenu, DropdownMenuItem, Button, Text, Icon } from '@expo/ui/jetpack-compose';
import { useState } from 'react';

export default function BasicDropdownMenuExample() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Host matchContents>
      <DropdownMenu expanded={isExpanded} onDismissRequest={() => setIsExpanded(false)}>
        <DropdownMenu.Trigger>
          <Button variant="bordered" onClick={() => setIsExpanded(true)}>
            Show Menu
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          <DropdownMenuItem
            onClick={() => {
              setIsExpanded(false);
              console.log('Home pressed');
            }}>
            <DropdownMenuItem.Text>
              <Text>Home</Text>
            </DropdownMenuItem.Text>
            <DropdownMenuItem.LeadingIcon>
              <Icon source={homeIcon} size={24} />
            </DropdownMenuItem.LeadingIcon>
          </DropdownMenuItem>
        </DropdownMenu.Items>
      </DropdownMenu>
    </Host>
  );
}