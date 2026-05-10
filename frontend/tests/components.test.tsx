import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../src/components/ui/StatusBadge';

describe('StatusBadge Component', () => {
  it('renders normal status correctly', () => {
    render(<StatusBadge status="normal" text="SYSTEM NORMAL" />);
    expect(screen.getByText('SYSTEM NORMAL')).toBeDefined();
  });

  it('renders emergency status with pulse class', () => {
    const { container } = render(<StatusBadge status="emergency" />);
    expect(container.firstChild).toHaveClass('animate-pulse');
    expect(screen.getByText('EMERGENCY')).toBeDefined();
  });
});
