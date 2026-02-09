import {useCallback, useEffect, useState} from 'react';

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
    const [resolvedTheme, setResolvedTheme] = useState<Theme>(() => {
        const stored = getStoredPreference();
        return stored === 'system' ? getSystemTheme() : stored;
    });

    useEffect(() => {
        const theme = preference === 'system' ? getSystemTheme() : preference;
        setResolvedTheme(theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [preference]);

    useEffect(() => {
        if (preference !== 'system') {
            return;
        }

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            const theme = media.matches ? 'dark' : 'light';
            setResolvedTheme(theme);
            document.documentElement.setAttribute('data-theme', theme);
        };

        media.addEventListener('change', handleChange);
        return () => media.removeEventListener('change', handleChange);
    }, [preference]);

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
