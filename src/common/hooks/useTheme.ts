import {useCallback, useEffect, useState, useSyncExternalStore} from 'react';

type Theme = 'light' | 'dark';
type ThemePreference = Theme | 'system';

const THEME_STORAGE_KEY = 'theme';

const getSystemTheme = (): Theme => {
    if (typeof window === 'undefined') {
        return 'dark';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getStoredPreference = (): ThemePreference => {
    if (typeof window === 'undefined') {
        return 'system';
    }

    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
        return stored;
    }

    return 'system';
};

export const useTheme = () => {
    const [preference, setPreference] = useState<ThemePreference>(() => getStoredPreference());
    const systemTheme = useSyncExternalStore(
        (callback) => {
            const media = window.matchMedia('(prefers-color-scheme: dark)');
            media.addEventListener('change', callback);
            return () => media.removeEventListener('change', callback);
        },
        getSystemTheme,
        () => 'dark'
    );
    const resolvedTheme = preference === 'system' ? systemTheme : preference;

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', resolvedTheme);
    }, [resolvedTheme]);

    const setThemePreference = useCallback((next: ThemePreference) => {
        setPreference(next);

        if (next === 'system') {
            window.localStorage.removeItem(THEME_STORAGE_KEY);
        } else {
            window.localStorage.setItem(THEME_STORAGE_KEY, next);
        }
    }, []);

    const toggleTheme = useCallback(() => {
        const next = resolvedTheme === 'dark' ? 'light' : 'dark';
        setThemePreference(next);
    }, [resolvedTheme, setThemePreference]);

    return {
        preference,
        resolvedTheme,
        setThemePreference,
        toggleTheme,
    };
};
