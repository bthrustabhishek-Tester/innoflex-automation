import type { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

export default class CustomReporter implements Reporter {
    private startTime: number = Date.now();
    private passed = 0;
    private failed = 0;
    private skipped = 0;
    private total = 0;
    private moduleStats: Record<string, { total: number; passed: number; failed: number; skipped: number }> = {};

    onBegin(config: FullConfig, suite: Suite) {
        this.startTime = Date.now();
        console.log('\n================================================================');
        console.log('         🚀 STARTING PLAYWRIGHT TEST EXECUTION          ');
        console.log('================================================================\n');
    }

    onTestEnd(test: TestCase, result: TestResult) {
        this.total++;
        const project = test.parent.project()?.name || 'default';

        if (!this.moduleStats[project]) {
            this.moduleStats[project] = { total: 0, passed: 0, failed: 0, skipped: 0 };
        }
        this.moduleStats[project].total++;

        if (result.status === 'passed') {
            this.passed++;
            this.moduleStats[project].passed++;
        } else if (result.status === 'failed' || result.status === 'timedOut') {
            this.failed++;
            this.moduleStats[project].failed++;
        } else {
            this.skipped++;
            this.moduleStats[project].skipped++;
        }
    }

    onEnd(result: FullResult) {
        const durationSec = ((Date.now() - this.startTime) / 1000).toFixed(1);
        const passRate = this.total > 0 ? ((this.passed / this.total) * 100).toFixed(1) : '0';

        console.log('\n================================================================');
        console.log('                 📊 EXECUTION SUMMARY REPORT                   ');
        console.log('================================================================');
        console.log(`  Total Tests Run : ${this.total}`);
        console.log(`  Passed          : ${this.passed} ✅`);
        console.log(`  Failed          : ${this.failed} ❌`);
        console.log(`  Skipped         : ${this.skipped} ⏭️`);
        console.log(`  Success Rate    : ${passRate}%`);
        console.log(`  Total Duration  : ${durationSec}s`);
        console.log('----------------------------------------------------------------');
        console.log(' Module / Project Breakdown:');
        console.log('----------------------------------------------------------------');
        for (const [mod, stats] of Object.entries(this.moduleStats)) {
            const modPassRate = stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(0) : '0';
            console.log(`  • ${mod.padEnd(16)} | Total: ${stats.total} | Passed: ${stats.passed} | Failed: ${stats.failed} | Pass Rate: ${modPassRate}%`);
        }
        console.log('================================================================\n');

        this.writeMarkdownReport(durationSec, passRate);
    }

    private writeMarkdownReport(durationSec: string, passRate: string) {
        const mdPath = path.join(process.cwd(), 'test_execution_summary.md');
        let mdContent = `# 📊 Automated Test Execution Summary Report\n\n`;
        mdContent += `*Report Generated On: ${new Date().toLocaleString()}*\n\n`;
        mdContent += `## Executive Summary\n\n`;
        mdContent += `| Metric | Count | Percentage |\n`;
        mdContent += `| :--- | :--- | :--- |\n`;
        mdContent += `| **Total Tests Executed** | **${this.total}** | **100%** |\n`;
        mdContent += `| **Passed** | **${this.passed}** | **${passRate}%** |\n`;
        mdContent += `| **Failed** | **${this.failed}** | **${((this.failed / (this.total || 1)) * 100).toFixed(1)}%** |\n`;
        mdContent += `| **Skipped** | **${this.skipped}** | **${((this.skipped / (this.total || 1)) * 100).toFixed(1)}%** |\n`;
        mdContent += `| **Overall Pass Rate** | — | **${passRate}%** |\n`;
        mdContent += `| **Total Duration** | — | **${durationSec}s** |\n\n`;

        mdContent += `## Module / Project Breakdown\n\n`;
        mdContent += `| Module / Project | Total Run | Passed | Failed | Skipped | Pass Rate |\n`;
        mdContent += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;

        for (const [mod, stats] of Object.entries(this.moduleStats)) {
            const modPassRate = stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(1) : '0';
            mdContent += `| **${mod}** | ${stats.total} | ${stats.passed} | ${stats.failed} | ${stats.skipped} | **${modPassRate}%** |\n`;
        }

        fs.writeFileSync(mdPath, mdContent, 'utf-8');
    }
}
