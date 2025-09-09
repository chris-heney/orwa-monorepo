import { 
    useRef, 
    // useEffect, 
    // useState 
} from 'react';
// import * as d3 from 'd3';
// import { useAppContext } from '../ctx-providers/AppContextProvider';
import { Box, Button, Typography } from '@mui/material';

const SunburstChart = (
    // { fundType }: { fundType: 'requested' | 'awarded' }
    ) => {
    // const { applications } = useAppContext();
    const ref = useRef<SVGSVGElement>(null);
    // const [history, setHistory] = useState<any[]>([]); // State to keep track of navigation history
    // const [currentLabel, setCurrentLabel] = useState<string>('Counties'); // Current label to display in the center

    // useEffect(() => {
    //     if (applications.length > 0) {
    //         const initialData = calculateCountyData();
    //         setHistory([initialData]); // Initialize history with the first layer
    //         drawChart(initialData);
    //     }
    // }, [applications, fundType]);

    // const drawChart = (data: any) => {
    //     const width = 600;  // Adjusted width for better manageability
    //     const radius = width / 2;

    //     const partition = (data: any) =>
    //         d3.partition().size([2 * Math.PI, radius])(
    //             d3
    //                 .hierarchy(data)
    //                 .sum((d) => d.value)
    //                 .sort((a, b) => b.value - a.value)
    //         );

    //     let root = partition(data);

    //     const color = d3.scaleOrdinal(d3.schemeCategory10);

    //     d3.select(ref.current).selectAll("*").remove(); // Clear previous content
    //     const svg = d3.select(ref.current)
    //         .attr('width', width)
    //         .attr('height', width)
    //         .append('g')
    //         .attr('transform', `translate(${width / 2},${width / 2})`);

    //     const arc = d3.arc<any>()
    //         .startAngle(d => d.x0)
    //         .endAngle(d => d.x1)
    //         .innerRadius(d => d.depth === 1 ? radius * 0.2 : radius * 0.3) // Dynamic inner radius
    //         .outerRadius(d => d.depth === 1 ? radius * 0.7 + d.value / root.value * radius * 0.3 : radius * 0.9); // Dynamic outer radius

    //     const paths = svg.selectAll('path')
    //         .data(root.descendants().filter(d => d.depth > 0)) // Filter out the root node (outermost layer)
    //         .enter().append('path')
    //         .attr('d', arc)
    //         .style('stroke', '#fff')
    //         .style('fill', d => color(d.data.name))
    //         .on('mouseover', function (event, d) {
    //             d3.select(this)
    //                 .style('cursor', 'pointer')
    //                 .style('opacity', 0.8);
    //         })
    //         .on('mouseout', function (event, d) {
    //             d3.select(this)
    //                 .style('cursor', 'default')
    //                 .style('opacity', 1);
    //         })
    //         .on('click', (event, d) => {
    //             if (d.depth === 1) {
    //                 const newData = calculateApplicationData(d.data.name);
    //                 setHistory(prevHistory => [...prevHistory, newData]); // Add to history
    //                 root = partition(newData);
    //                 updateChart(root, d.data.name);
    //             } else if (d.depth === 2) {
    //                 const newData = calculateProjectData(d.data.name, d.parent.data.name);
    //                 setHistory(prevHistory => [...prevHistory, newData]); // Add to history
    //                 root = partition(newData);
    //                 updateChart(root, d.data.name);
    //             }
    //         })
    //         .append('title')
    //         .text(d => {
    //             // Check the depth to display the correct information
    //             if (d.depth === 2) {
    //                 return `${d.data.name}\n${d.value.toLocaleString()} ${fundType === 'awarded' ? 'awarded' : 'requested'} funds`;
    //             } else if (d.depth === 1) {
    //                 return `${d.data.name}\n${d.value.toLocaleString()} ${fundType === 'awarded' ? 'awarded' : 'requested'} funds`;
    //             } else {
    //                 return `${d.data.name}\n${d.value.toLocaleString()}`;
    //             }
    //         });

    //     function updateChart(newRoot: any, label: string) {
    //         const newPaths = svg.selectAll('path')
    //             .data(newRoot.descendants().filter(d => d.depth > 0)); // Filter out the root node (outermost layer)

    //         newPaths.enter().append('path')
    //             .attr('d', arc)
    //             .style('stroke', '#fff')
    //             .style('fill', d => color(d.data.name))
    //             .merge(newPaths)
    //             .transition().duration(1000) // Smooth transition
    //             .attr('d', arc)
    //             .style('fill', d => color(d.data.name));

    //         newPaths.exit().remove();

    //         // Update center label
    //         setCurrentLabel(label);

    //         // Add a label in the center with smooth transition
    //         svg.selectAll('text').remove(); // Clear previous text
    //         svg.append('text')
    //             .attr('text-anchor', 'middle')
    //             .attr('dy', '0.35em')
    //             .style('font-size', '20px')
    //             .style('font-weight', 'bold')
    //             .transition().duration(1000)
    //             .text(label);
    //     }
    // };

    // const goBack = () => {
    //     if (history.length > 1) {
    //         const newHistory = [...history];
    //         newHistory.pop(); // Remove the last item
    //         setHistory(newHistory); // Update history
    //         const previousData = newHistory[newHistory.length - 1];
    //         drawChart(previousData); // Redraw chart with previous data
    //         setCurrentLabel(newHistory.length === 1 ? 'Counties' : previousData.name); // Update the label
    //     }
    // };

    // const calculateCountyData = () => {
    //     const countyData = applications.reduce((acc, currentApplication) => {
    //         const county = currentApplication.county || 'Unknown';
    //         const amount = fundType === 'awarded'
    //             ? currentApplication.award_amount || 0
    //             : currentApplication.requested_grant_amount ? parseInt(currentApplication.requested_grant_amount.toString()) : 0;

    //         if (!acc[county]) {
    //             acc[county] = 0;
    //         }
    //         acc[county] += amount;

    //         return acc;
    //     }, {} as { [key: string]: number });

    //     return {
    //         name: 'Counties',
    //         children: Object.entries(countyData).map(([name, value]) => ({
    //             name,
    //             value
    //         })),
    //     };
    // };

    // const calculateApplicationData = (countyName: string) => {
    //     const applicationsInCounty = applications.filter(app => app.county === countyName);

    //     return {
    //         name: countyName,
    //         children: applicationsInCounty.map(app => ({
    //             name: app.legal_entity_name,
    //             value: fundType === 'awarded'
    //                 ? app.award_amount || 0
    //                 : app.requested_grant_amount || 0,
    //         })),
    //     };
    // };

    // const calculateProjectData = (applicationName: string, countyName: string) => {
    //     const currentApplication = applications.find(app => app.legal_entity_name === applicationName && app.county === countyName);
    //     const projects = currentApplication?.approved_projects?.data || [];

    //     return {
    //         name: applicationName,
    //         children: projects.map(project => ({
    //             name: project.name,
    //             value: fundType === 'awarded'
    //                 ? (currentApplication?.award_amount || 0) / projects.length
    //                 : (currentApplication?.requested_grant_amount || 0) / projects.length,
    //         })),
    //     };
    // };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                {/* {currentLabel} */}
            </Typography>
            <Button variant="outlined" 
            // onClick={goBack} 
            disabled={history.length <= 1}
            >
                Go Back
            </Button>
            <svg ref={ref}></svg>
        </Box>
    );
};

export default SunburstChart;