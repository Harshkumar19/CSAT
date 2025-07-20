import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Loader2, AlertCircle, TrendingUp, Users, Star } from 'lucide-react';

const CSATDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sheets');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSatisfactionColor = (value) => {
    if (!value) return 'secondary';
    const numValue = parseFloat(value);
    if (numValue >= 4) return 'default';
    if (numValue >= 3) return 'secondary';
    return 'destructive';
  };

  const calculateAverageRating = (sheetData, ratingField) => {
    if (!sheetData?.data) return 0;
    const ratings = sheetData.data
      .map(row => parseFloat(row[ratingField]))
      .filter(rating => !isNaN(rating));
    
    if (ratings.length === 0) return 0;
    return (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1);
  };

  const renderSheetStats = (sheetData, sheetName) => {
    if (!sheetData?.data) return null;

    const totalResponses = sheetData.data.length;
    const overallSatisfaction = calculateAverageRating(sheetData, 'Overall Satisfaction');
    const likelihoodToRecommend = calculateAverageRating(sheetData, 'Likelihood To Recommend');

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResponses}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallSatisfaction}/5</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Likelihood to Recommend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{likelihoodToRecommend}/5</div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderDataTable = (sheetData) => {
    if (!sheetData?.data || sheetData.data.length === 0) {
      return (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">No data available</p>
          </CardContent>
        </Card>
      );
    }

    const headers = sheetData.headers;
    const rows = sheetData.data;

    return (
      <Card>
        <CardHeader>
          <CardTitle>{sheetData.sheetName} Feedback Data</CardTitle>
          <CardDescription>
            Customer satisfaction feedback for {sheetData.sheetName} department
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header, index) => (
                    <TableHead key={index} className="whitespace-nowrap">
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {headers.map((header, colIndex) => (
                      <TableCell key={colIndex} className="whitespace-nowrap">
                        {header.includes('Satisfaction') || header.includes('Recommend') || header.includes('Effectiveness') ? (
                          <Badge variant={getSatisfactionColor(row[header])}>
                            {row[header] || 'N/A'}
                          </Badge>
                        ) : header === 'Additional Comments' ? (
                          <div className="max-w-xs truncate" title={row[header]}>
                            {row[header] || '-'}
                          </div>
                        ) : header === 'CreatedAt' ? (
                          <div className="text-sm text-muted-foreground">
                            {row[header] ? new Date(row[header]).toLocaleDateString() : '-'}
                          </div>
                        ) : (
                          row[header] || '-'
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading CSAT data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Error Loading Data</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
            <button
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">CSAT Dashboard</h1>
        <p className="text-muted-foreground">Customer Satisfaction Analysis across all departments</p>
      </div>

      <Tabs defaultValue="tech" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tech">TECH</TabsTrigger>
          <TabsTrigger value="media">MEDIA</TabsTrigger>
          <TabsTrigger value="solutions">SOLUTIONS</TabsTrigger>
        </TabsList>

        <TabsContent value="tech" className="space-y-6">
          {renderSheetStats(data?.TECH, 'TECH')}
          {renderDataTable(data?.TECH)}
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          {renderSheetStats(data?.MEDIA, 'MEDIA')}
          {renderDataTable(data?.MEDIA)}
        </TabsContent>

        <TabsContent value="solutions" className="space-y-6">
          {renderSheetStats(data?.SOLUTIONS, 'SOLUTIONS')}
          {renderDataTable(data?.SOLUTIONS)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CSATDashboard;
