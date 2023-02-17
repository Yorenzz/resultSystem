import { use } from 'echarts/core'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart,
	LineChart,
	PieChart,
	CustomChart,
	RadarChart } from 'echarts/charts'
import { GridComponent,
	TooltipComponent,
	TitleComponent,
	ToolboxComponent,
	LegendComponent } from 'echarts/components'
import { UniversalTransition,
	LabelLayout } from 'echarts/features'

use([
	CanvasRenderer,
	BarChart,
	LineChart,
	GridComponent,
	TooltipComponent,
	PieChart,
	TitleComponent,
	ToolboxComponent,
	LegendComponent,
	UniversalTransition,
	LabelLayout,
	CustomChart,
	RadarChart,
])

export const echartsInit = (chartRef) => {
	const chartInstance = echarts.init(chartRef)
	window.addEventListener('resize', () => {
		chartInstance.resize()
	})
	return chartInstance
}
