import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface VerifyResult {
  success: boolean;
  errorMsg?: string;
}

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const verifyPassword = async (password: string): Promise<VerifyResult> => {
    try {
      const { data, error } = await supabase
        .from('queryhosxpsabot_admin_settings')
        .select('setting_value')
        .eq('setting_key', 'admin_password')
        .single();

      if (error) {
        console.error('Error fetching admin password:', error.message);
        return { success: false, errorMsg: 'Error verifying password.' };
      }

      const isValid = data && data.setting_value === password;

      if (isValid) {
        setIsAuthenticated(true);
        return { success: true };
      }

      return { success: false, errorMsg: 'Invalid Admin Password.' };
    } catch (_e: unknown) {
      return { success: false, errorMsg: 'Error verifying password.' };
    }
  };

  return { isAuthenticated, verifyPassword };
}
