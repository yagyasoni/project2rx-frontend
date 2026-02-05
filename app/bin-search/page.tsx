'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import Sidebar from '@/components/Sidebar'

export default function BinSearch() {
    const [binNumber, setBinNumber] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [activePanel, setActivePanel] = useState<string | null>(null)

    const handleBinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setBinNumber(value);
    };

    const handleSearch = () => {
        if (binNumber.length === 6) {
            console.log('Searching for BIN:', binNumber);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && binNumber.length === 6) {
            handleSearch();
        }
    };

    return (
        /* FIX 1: Use 'flex' here to put Sidebar and Content side-by-side */
        <div className="flex min-h-screen bg-gray-50">
            
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activePanel={activePanel}
                setActivePanel={setActivePanel}
            />
            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                <Tabs defaultValue="bin-search" className="w-full">
                    <TabsList className="mb-8 bg-transparent border-b border-gray-200 rounded-none h-auto p-0 w-full justify-start">
                        <TabsTrigger
                            value="bin-search"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 font-medium text-gray-600 data-[state=active]:text-black"
                        >
                            Bin Search
                        </TabsTrigger>
                        <TabsTrigger
                            value="aberrant-search"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 font-medium text-gray-600 data-[state=active]:text-black"
                        >
                            Aberrant Search
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="bin-search" className="mt-12">
                        {/* Reduced min-h here to prevent excessive scrolling */}
                        <div className="flex items-center justify-center min-h-[50vh]">
                            <Card className="w-full max-w-2xl shadow-lg border border-gray-200">
                                <CardContent className="p-12">
                                    <div className="text-center mb-8">
                                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                            Search Insurance BIN
                                        </h1>
                                        <p className="text-lg text-gray-500">
                                            Enter a 6-digit BIN number to get started.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="bin-number" className="block text-sm font-medium text-gray-700 mb-2">
                                            BIN number
                                        </label>
                                        <div className="relative">
                                            <Input
                                                id="bin-number"
                                                type="text"
                                                value={binNumber}
                                                onChange={handleBinChange}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Enter a 6-digit BIN number"
                                                className="pr-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                maxLength={6}
                                            />
                                            <button
                                                onClick={handleSearch}
                                                disabled={binNumber.length !== 6}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                aria-label="Search"
                                            >
                                                <Search className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {binNumber.length}/6 digits
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="aberrant-search" className="mt-12">
                        <div className="flex items-center justify-center min-h-[50vh]">
                            <Card className="w-full max-w-2xl shadow-lg border border-gray-200">
                                <CardContent className="p-12">
                                    <div className="text-center mb-8">
                                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                            Aberrant Search
                                        </h1>
                                        <p className="text-lg text-gray-500">
                                            Search for aberrant records and discrepancies.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="aberrant-search" className="block text-sm font-medium text-gray-700 mb-2">
                                            Search query
                                        </label>
                                        <div className="relative">
                                            <Input
                                                id="aberrant-search"
                                                type="text"
                                                placeholder="Enter search query"
                                                className="pr-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            <button
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                                                aria-label="Search"
                                            >
                                                <Search className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}