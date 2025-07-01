import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import type { SelectProps } from 'antd/es/select';
import debounce from 'lodash/debounce';

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
    fetchOptions: (search: string) => Promise<ValueType[]>;
    debounceTimeout?: number;
}

export function DebounceSelect<
    ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,
>({ fetchOptions, debounceTimeout = 800, value, ...props }: DebounceSelectProps<ValueType>) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<ValueType[]>([]);
    const [fetched, setFetched] = useState(false); // ✅ new

    const fetchRef = useRef(0);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (search: string) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setFetching(true);

            fetchOptions(search).then((newOptions) => {
                if (fetchId !== fetchRef.current) return;
                setOptions(newOptions);
                setFetching(false);
                setFetched(true); // ✅ mark as fetched
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);

    const handleOnFocus = () => {
        // ✅ always fetch on first focus if not fetched from DB
        if (!fetched) {
            fetchOptions("").then((newOptions) => {
                setOptions(newOptions);
                setFetched(true);
            });
        }
    };

    const handleOnBlur = () => {
        setOptions([]);
        setFetched(false); // ✅ reset to fetch again on next open
    };

    // Ensure value stays in options for correct display
    useEffect(() => {
        if (!value) return;

        const values = Array.isArray(value) ? value : [value];
        let newOptions = [...options];

        values.forEach((val) => {
            const exists = newOptions.some((opt) => opt.value === val.value);
            if (!exists) {
                newOptions.push(val as ValueType);
            }
        });

        // ✅ Xử lý loại trùng value
        const uniqueOptions = newOptions.reduce((acc: ValueType[], curr) => {
            const exists = acc.some(opt => opt.value === curr.value);
            if (!exists) acc.push(curr);
            return acc;
        }, []);

        setOptions(uniqueOptions);
    }, [value]);

    return (
        <Select
            labelInValue
            showSearch
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            options={options}
            value={value}
            {...props}
        />
    );
}
