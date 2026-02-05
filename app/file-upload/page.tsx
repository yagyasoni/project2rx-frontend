'use client';

import { useState } from 'react';
import { ChevronLeft, Check, X, ChevronDown } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface FieldMapping {
    label: string;
    required: boolean;
    value: string;
}

export default function FileUploadPage() {
    const [headerRow, setHeaderRow] = useState('Row 1');
    const [fieldMappings, setFieldMappings] = useState<
        Record<string, string | null>
    >({
        ndcNumber: 'NDC',
        rxNumber: 'RXNO',
        status: 'STATUS',
        dateFilled: "DATEFILLED",
        drugName: 'DRUGNAME',
        quantity: 'QUANTITY',
        packageSize: 'PACKAGESIZE',
        primaryInsuranceBinNumber: 'PRIINSBINNO',
        primaryInsurancePaid: 'PRIINSPAID',
        secondaryInsuranceBinNumber: 'SECINSBINNO',
        secondaryInsurancePaid: 'SECINSPAID',
        brand: 'BRAND',
    });

    const headerOptions = ['Row 1', 'Row 2', 'Row 3'];

    const columnOptions = [
        'NDC',
        'RXNO',
        'STATUS',
        'DATEFILLED',
        'DRUGNAME',
        'QUANTITY',
        'PACKAGESIZE',
        'PRIINSBINNO',
        'PRIINSPAID',
        'SECINSBINNO',
        'SECINSPAID',
        'BRAND',

    ];

    const fields: FieldMapping[] = [
        { label: 'Ndc Number', required: true, value: 'ndcNumber' },
        { label: 'Rx Number', required: true, value: 'rxNumber' },
        { label: 'Status', required: true, value: 'status' },
        { label: 'Date Filled', required: true, value: 'dateFilled' },
        { label: 'Drug Name', required: true, value: 'drugName' },
        { label: 'Quantity', required: true, value: 'quantity' },
        { label: 'Package Size', required: false, value: 'packageSize' },
        {
            label: 'Primary Insurance Bin Number',
            required: true,
            value: 'primaryInsuranceBinNumber',
        },
        {
            label: 'Primary Insurance Paid',
            required: true,
            value: 'primaryInsurancePaid',
        },
        {
            label: 'Secondary Insurance Bin Number',
            required: false,
            value: 'secondaryInsuranceBinNumber',
        },
        {
            label: 'Secondary Insurance Paid',
            required: false,
            value: 'secondaryInsurancePaid',
        },
        { label: 'Brand', required: false, value: 'brand' },
    ];

    const handleFieldChange = (fieldKey: string, value: string) => {
        setFieldMappings((prev) => ({
            ...prev,
            [fieldKey]: value,
        }));
    };

    const handleClearField = (fieldKey: string) => {
        setFieldMappings((prev) => ({
            ...prev,
            [fieldKey]: null,
        }));
    };

    const handleSubmit = () => {
        console.log('Submitting with mappings:', fieldMappings);
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-3xl mx-auto px-6 py-12">
                <button
                    className="mb-8 flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                    onClick={() => window.history.back()}
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                <div className="text-center mb-12">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-3">
                        PRIMERX | File Upload
                    </h1>
                    <p className="text-gray-600 text-sm mb-2">
                        Select the file headers below and click upload
                    </p>
                    <p className="text-gray-500 text-xs mb-4">
                        File - PRIMERX JAN 1 - DEC 26.csv
                    </p>
                    <p className="text-red-500 text-sm font-medium">
                        Please make sure to include all your columns below.
                    </p>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                        <span className="text-sm font-medium text-gray-700 w-24">
                            Header
                        </span>
                        <div className="flex-1">
                            <Select value={headerRow} onValueChange={setHeaderRow}>
                                <SelectTrigger className="bg-white border-gray-300 h-9 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-500" />
                                        <SelectValue />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className='bg-white'>
                                    {headerOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2">
                    {fields.map((field) => {
                        const selectedValue = fieldMappings[field.value];
                        const hasValue = selectedValue !== null;

                        return (
                            <div
                                key={field.value}
                                className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
                            >
                                <div className="w-56">
                                    <span className="text-sm font-medium text-gray-700">
                                        {field.label}
                                        {field.required && (
                                            <span className="text-red-500 ml-1">*</span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex-1 flex items-center gap-2">
                                    <div className="flex-1">
                                        <Select
                                            value={selectedValue || ''}
                                            onValueChange={(value) =>
                                                handleFieldChange(field.value, value)
                                            }
                                        >
                                            <SelectTrigger className="bg-white border-gray-300 h-9 text-sm">
                                                {hasValue ? (
                                                    <div className="flex items-center gap-2">
                                                        <Check className="w-4 h-4 text-green-500" />
                                                        <SelectValue placeholder="Select file header" />
                                                    </div>
                                                ) : (
                                                    <SelectValue placeholder="Select file header" />
                                                )}
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                {columnOptions.map((option) => (
                                                    <SelectItem key={option} value={option}>
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {hasValue && (
                                        <button
                                            onClick={() => handleClearField(field.value)}
                                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                                        >
                                            <X className="w-4 h-4 text-gray-500" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 flex justify-center">
                    <Button
                        onClick={handleSubmit}
                        className="px-8 text-white bg-gradient-to-r from-[#0D0D0D] to-[#404040] transition"
                    >
                        Submit Upload
                    </Button>
                </div>
            </div>
        </div>
    );
}
