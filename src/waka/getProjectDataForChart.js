import waka from './getDataFromMongo';

const parse = async (user, limit) => {
    const data = await waka(user, limit);

    // in second
    const threshold = 120;

    let all_project_names = [];
    let projects = {};

    for (let i = data.length - 1; i >= 0; i--) {
        const projectNames = Object.keys(data[i]['projects']);
        for (let p = 0; p < projectNames.length; p++) {
            if (!all_project_names.includes(projectNames[p])) {
                all_project_names.push(projectNames[p]);
                projects[projectNames[p]] = [];
            }
        }
    }

    let mydata = [];
    let label = [];

    let count = 0;
    for (let i = data.length - 1; i >= 0; i--) {
        // for every day
        mydata[count] = {};
        const date = data[i]['date'];
        const minutes = Math.round(data[i]['total'] / 60.0 * 100) / 100.0;
        label.push(date);

        mydata[count]['x'] = date + " (total: " + minutes + " minutes)";
        mydata[count]['y'] = minutes;

        for (let p = 0; p < all_project_names.length; p++) {
            projects[all_project_names[p]].push({x: date, y: 0});
        }
        const projectNames = Object.keys(data[i]['projects']);
        for (let p = 0; p < projectNames.length; p++) {
            const projectName = projectNames[p];
            if (data[i]['projects'][projectName] > threshold)
                projects[projectName][count]['y'] = data[i]['projects'][projectName];
        }
        count++;
    }
    let project_datasets = [];
    const projectNames = Object.keys(projects);
    for (let p = 0; p < projectNames.length; p++) {
        // check if project time too small
        let check = false;
        for (let t = 0; t < projects[projectNames[p]].length; t++) {
            if (projects[projectNames[p]][t]['y'] > threshold) {
                check = true;
                break;
            }
        }
        if (!check) {
            continue;
        }
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        project_datasets.push({
            label: projectNames[p],
            data: projects[projectNames[p]],
            backgroundColor: 'rgba(' + r + ', ' + g + ',' + b + ', 0.8)'
        });
    }

    project_datasets.sort((pa, pb) => {
        let sum_a = 0, sum_b = 0;
        for (let t = 0; t < pa['data'].length; t++) {
            sum_a += pa['data'][t]['y'];
            sum_b += pb['data'][t]['y'];
        }
        return sum_b - sum_a;
    });

    return {
        labels: label,
        datasets: project_datasets,
    };
};

export default parse;
